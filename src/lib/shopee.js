import crypto from 'crypto';

const priceCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;
const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.com.br/graphql';

export async function fetchShopeePrice(keyword) {
  const cleanKeyword = (keyword || '').trim();
  if (!cleanKeyword) {
    return null;
  }

  const cacheKey = cleanKeyword.toLowerCase();
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { ...cached.data, cached: true };
  }

  const appId = process.env.SHOPEE_APP_ID;
  const secret = process.env.SHOPEE_SECRET;

  if (!appId || !secret) {
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const query = `
    query GetOffers($keyword: String) {
      productOfferV2(keyword: $keyword, page: 1, limit: 5) {
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

  const payload = JSON.stringify({ query, variables: { keyword: cleanKeyword } });
  const signature = crypto
    .createHash('sha256')
    .update(`${appId}${timestamp}${payload}${secret}`)
    .digest('hex');

  try {
    const res = await fetch(SHOPEE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`
      },
      body: payload,
      next: { revalidate: 900 }
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json.errors && json.errors.length) return null;

    const offers = json.data?.productOfferV2?.nodes || [];
    const offer = offers[0];
    if (!offer) return null;

    const priceMin = Number(offer.priceMin ?? offer.price);
    const priceMax = Number(offer.priceMax ?? offer.price);
    if (!Number.isFinite(priceMin) || priceMin <= 0) return null;

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
    return priceData;
  } catch (err) {
    console.error(`Erro ao consultar API Shopee para "${cleanKeyword}":`, err);
    return null;
  }
}
