import { NextResponse } from 'next/server';
import { fetchShopeePrice } from '@/lib/shopee';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword || keyword.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: 'Parâmetro keyword é obrigatório.' },
      { status: 400 }
    );
  }

  const priceData = await fetchShopeePrice(keyword);

  if (!priceData) {
    return NextResponse.json({
      success: false,
      error: 'Preço indisponível no momento ou produto não encontrado.'
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: priceData
  });
}
