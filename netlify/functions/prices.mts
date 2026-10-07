import type { Config, Context } from '@netlify/functions';
import crypto from 'node:crypto';

const priceCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 15 * 60 * 1000;
const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.com.br/graphql';

// Credenciais padrão da Shopee (conforme .env.example) para contingência
const DEFAULT_APP_ID = '18383441255';
const DEFAULT_SECRET = 'LESUKOG4BCPRACEAUIF6AGJCUNHQYHFD';

function getCredentials(): { appId: string; secret: string } {
  const appId =
    (typeof Netlify !== 'undefined' && Netlify.env ? Netlify.env.get('SHOPEE_APP_ID') : null) ||
    process.env.SHOPEE_APP_ID ||
    DEFAULT_APP_ID;
  const secret =
    (typeof Netlify !== 'undefined' && Netlify.env ? Netlify.env.get('SHOPEE_SECRET') : null) ||
    process.env.SHOPEE_SECRET ||
    DEFAULT_SECRET;

  return { appId, secret };
}

function getQueryCandidates(title: string): string[] {
  const candidates: string[] = [title];

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

  // Termos simplificados caso a consulta inicial com nome longo falhe
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

async function querySingleShopee(keyword: string, appId: string, secret: string) {
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
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    throw new Error(`A API da Shopee respondeu com HTTP ${response.status}.`);
  }

  const result = (await response.json()) as any;
  if (result.errors && result.errors.length) {
    throw new Error('A API da Shopee rejeitou a consulta GraphQL.');
  }

  return result.data?.productOfferV2?.nodes || [];
}

async function queryShopeeWithCandidates(keyword: string, appId: string, secret: string) {
  const candidates = getQueryCandidates(keyword);

  for (const candidate of candidates) {
    try {
      const nodes = await querySingleShopee(candidate, appId, secret);
      if (nodes && nodes.length > 0) {
        return nodes[0];
      }
    } catch (err) {
      console.warn(`Falha na consulta candidata "${candidate}":`, err);
    }
  }

  return null;
}

function getCachedPrice(key: string) {
  const cached = priceCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp >= CACHE_TTL_MS) {
    priceCache.delete(key);
    return null;
  }
  return cached.data;
}

export default async (req: Request, _context: Context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Cache-Control': 'no-store'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Método não permitido.' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { appId, secret } = getCredentials();
  if (!appId || !secret) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'A integração da Shopee ainda não foi configurada no servidor.'
      }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let keyword = '';
  if (req.method === 'GET') {
    const url = new URL(req.url);
    keyword = url.searchParams.get('keyword') || '';
  } else {
    try {
      const body = (await req.json()) as any;
      keyword = typeof body?.keyword === 'string' ? body.keyword : '';
    } catch {
      keyword = '';
    }
  }

  keyword = keyword.trim();
  if (!keyword || keyword.length > 200) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Informe o nome do produto (até 200 caracteres) para consultar o preço.'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const cacheKey = keyword.toLocaleLowerCase('pt-BR');
  const cached = getCachedPrice(cacheKey);
  if (cached) {
    return new Response(
      JSON.stringify({ success: true, cached: true, data: cached }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const offer = await queryShopeeWithCandidates(keyword, appId, secret);
    if (!offer) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nenhuma oferta correspondente foi encontrada na Shopee.'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
      offerLink: offer.offerLink || null,
      updatedAt: new Date().toISOString()
    };

    priceCache.set(cacheKey, { timestamp: Date.now(), data: priceData });

    return new Response(
      JSON.stringify({ success: true, data: priceData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Erro ao consultar preços na Shopee:', error?.message || error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Não foi possível consultar o preço na Shopee agora.'
      }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

export const config: Config = {
  path: '/api/prices'
};
