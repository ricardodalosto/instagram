import './globals.css';
import { Barlow_Condensed, Manrope } from 'next/font/google';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-barlow'
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope'
});

export const metadata = {
  title: 'RD Store | Treino começa aqui - Catálogo Oficial Shopee',
  description: 'Equipamentos, suplementos, roupas e acessórios para levar seu treino mais longe. Catálogo Geral com preços atualizados da Shopee.',
  keywords: ['shopee', 'treino', 'musculação', 'suplementos', 'creatina', 'whey', 'academia', 'rd store'],
  openGraph: {
    title: 'RD Store | Treino começa aqui - Catálogo Geral Shopee',
    description: 'Equipamentos, suplementos, roupas e acessórios para levar seu treino mais longe.',
    locale: 'pt_BR',
    type: 'website'
  }
};

export const viewport = {
  themeColor: '#090a0d',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${barlowCondensed.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
