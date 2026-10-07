const crypto = require('crypto');
const fetch = require('node-fetch');

const priceCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;
const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.com.br/graphql';

const DEFAULT_APP_ID = '18383441255';
const DEFAULT_SECRET = 'LESUKOG4BCPRACEAUIF6AGJCUNHQYHFD';

function getCredentials() {
  const appId = process.env.SHOPEE_APP_ID || DEFAULT_APP_ID;
  const secret = process.env.SHOPEE_SECRET || DEFAULT_SECRET;
  return { appId, secret };
}

function getQueryCandidates(title) {
  const candidates = [title];

  if (title.includes('Growth Supplements - 250 g')) {
    candidates.push('Creatina Growth 250g', 'Creatina Monohidratada Growth');
  }
  if (title.includes('Growth Supplements - 500 g')) {
    candidates.push('Creatina Growth 500g', 'Creatina Monohidratada Growth');
  }
  if (title.includes('Basic Whey 1kg Growth Supplements')) {
    candidates.push('Basic Whey Growth', 'Basic Whey 1kg Growth');
  }
  if (title.includes('Whey Core 70%')) {
    candidates.push('Whey Core 900g Soldiers Nutrition', 'Whey Core Soldiers Nutrition');
  }
  if (title.includes('Kit de Halteres e Anilhas de 15 kg com Kettlebell')) {
    candidates.push('Kit Halteres Anilhas 15 kg Kettlebell', 'Kit de Halteres e Anilhas de 15 kg');
  }

  const simplified = title
    .replace(/\(.*?\)/g, '')
    .replace(/[|]/g, ' ')
    .replace(/Growth Supplements/gi, 'Growth')
    .replace(/Sem sabor em pó/gi, '')
    .replace(/70% de Proteína Concentrada -/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (simplified && !candidates.includes(simplified)) {
    candidates.push(simplified);
  }

  return candidates;
}

async function queryShopeeApi(keyword, appId, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const query = `
    query GetOffers($keyword: String) {
      productOfferV2(keyword: $keyword, page: 1, limit: 3) {
        nodes {
          itemId
          productName
          price
          priceMin
          priceMax
          priceDiscountRate
          offerLink
        }
      }
    }
  `;
  const payload = JSON.stringify({ query, variables: { keyword } });
  const signature = crypto
    .createHash('sha256')
    .update(`${appId}${timestamp}${payload}${secret}`)
    .digest('hex');

  const response = await fetch(SHOPEE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`
    },
    body: payload,
    timeout: 10000
  });

  if (!response.ok) {
    throw new Error(`A API da Shopee respondeu com HTTP ${response.status}.`);
  }

  const result = await response.json();
  if (result.errors && result.errors.length) {
    throw new Error('A API da Shopee rejeitou a consulta. Confira as credenciais e a consulta GraphQL.');
  }

  return result.data?.productOfferV2?.nodes || [];
}

async function queryShopeeWithCandidates(keyword, appId, secret) {
  const candidates = getQueryCandidates(keyword);

  for (const candidate of candidates) {
    try {
      const nodes = await queryShopeeApi(candidate, appId, secret);
      if (nodes && nodes.length > 0) {
        return nodes[0];
      }
    } catch (err) {
      console.warn(`Falha na consulta candidata "${candidate}":`, err.message);
    }
  }

  return null;
}

function getCachedPrice(keyword) {
  const cached = priceCache.get(keyword);
  if (!cached) return null;
  if (Date.now() - cached.timestamp >= CACHE_TTL_MS) {
    priceCache.delete(keyword);
    return null;
  }
  return cached.data;
}

async function getPricesHandler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ success: false, error: 'Método não permitido.' });
  }

  const { appId, secret } = getCredentials();
  if (!appId || !secret) {
    return res.status(503).json({
      success: false,
      error: 'A integração da Shopee ainda não foi configurada no servidor.'
    });
  }

  const input = req.method === 'POST' ? req.body : req.query;
  const keyword = typeof input?.keyword === 'string' ? input.keyword.trim() : '';
  if (!keyword || keyword.length > 200) {
    return res.status(400).json({
      success: false,
      error: 'Informe o nome do produto (até 200 caracteres) para consultar o preço.'
    });
  }

  const cacheKey = keyword.toLocaleLowerCase('pt-BR');
  const cached = getCachedPrice(cacheKey);
  if (cached) {
    return res.json({ success: true, cached: true, data: cached });
  }

  try {
    const offer = await queryShopeeWithCandidates(keyword, appId, secret);
    if (!offer) {
      return res.status(404).json({
        success: false,
        error: 'Nenhuma oferta correspondente foi encontrada na Shopee.'
      });
    }

    const priceMin = Number(offer.priceMin ?? offer.price);
    const priceMax = Number(offer.priceMax ?? offer.price);
    if (!Number.isFinite(priceMin) || priceMin <= 0) {
      throw new Error('A Shopee retornou uma oferta sem preço válido.');
    }

    const priceData = {
      available: true,
      name: offer.productName,
      priceMin,
      priceMax: Number.isFinite(priceMax) ? priceMax : priceMin,
      discount: Number(offer.priceDiscountRate) || 0,
      currency: 'BRL',
      updatedAt: new Date().toISOString()
    };

    priceCache.set(cacheKey, { timestamp: Date.now(), data: priceData });
    return res.json({ success: true, data: priceData });
  } catch (error) {
    console.error('Erro ao consultar preços na Shopee:', error.message);
    return res.status(502).json({
      success: false,
      error: 'Não foi possível consultar o preço na Shopee agora.'
    });
  }
}

module.exports = getPricesHandler;
