import { NextResponse } from 'next/server';
import { fetchShopeePrice } from '@/lib/shopee';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getAllowedOrigins() {
  const origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    ...(process.env.SITE_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean),
    ...(process.env.NEXT_PUBLIC_SITE_ORIGIN || '').split(',').map((origin) => origin.trim()).filter(Boolean),
  ];

  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
  }

  return [...new Set(origins.filter(Boolean))];
}

function applyCors(response, request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();

  let isAllowed = !origin;

  if (origin) {
    try {
      const hostname = new URL(origin).hostname;
      isAllowed = allowedOrigins.includes(origin) || hostname.endsWith('.vercel.app');
    } catch {
      isAllowed = false;
    }
  }

  if (!isAllowed) {
    return response;
  }

  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }

  return response;
}

export async function OPTIONS(request) {
  const response = new NextResponse(null, { status: 204 });
  return applyCors(response, request);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword || keyword.trim().length === 0) {
    return applyCors(
      NextResponse.json(
        { success: false, error: 'Parâmetro keyword é obrigatório.' },
        { status: 400 }
      ),
      request
    );
  }

  const appId = process.env.SHOPEE_APP_ID;
  const secret = process.env.SHOPEE_SECRET;

  if (!appId || !secret) {
    return applyCors(
      NextResponse.json(
        {
          success: false,
          error: 'Credenciais da Shopee não configuradas. Defina SHOPEE_APP_ID e SHOPEE_SECRET no Vercel.'
        },
        { status: 503 }
      ),
      request
    );
  }

  const priceData = await fetchShopeePrice(keyword);

  if (!priceData) {
    return applyCors(
      NextResponse.json(
        { success: false, error: 'Preço indisponível no momento ou produto não encontrado.' },
        { status: 404 }
      ),
      request
    );
  }

  return applyCors(
    NextResponse.json({
      success: true,
      data: priceData
    }),
    request
  );
}
