'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import CategorySection from '@/components/CategorySection';
import Manifesto from '@/components/Manifesto';
import AboutSection from '@/components/AboutSection';
import SocialSection from '@/components/SocialSection';
import Footer from '@/components/Footer';
import catalogData from '@/data/catalog.json';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter products based on search term and category pill
  const filteredCatalog = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return catalogData
      .map((section) => {
        if (activeCategory !== 'all' && section.id !== activeCategory) {
          return null;
        }

        const matchingProducts = section.products.filter((product) => {
          if (!term) return true;
          return (
            product.title.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
          );
        });

        if (matchingProducts.length === 0) return null;

        return {
          ...section,
          products: matchingProducts
        };
      })
      .filter(Boolean);
  }, [searchTerm, activeCategory]);

  return (
    <>
      <Header />
      <main id="inicio">
        <Hero />
        <Ticker />

        <section className="wrap section" id="destaques" aria-labelledby="products-title">
          {/* Banner Destaque Catálogo Geral Shopee */}
          <div className="shopee-showcase-card" aria-label="Catálogo Geral de Todos os Produtos">
            <div className="shopee-showcase-content">
              <div className="shopee-badge">🏬 Loja Oficial Shopee</div>
              <h3>Catálogo Geral com Todos os Produtos</h3>
              <p>
                Quer explorar nossa vitrine completa com centenas de suplementos, halteres,
                estações de musculação, roupas fitness e acessórios de alta performance?
                Acesse agora nossa loja oficial na Shopee e aproveite cupons e frete grátis!
              </p>
              <a
                href="https://collshp.com/dalosto?view=storefront"
                target="_blank"
                rel="noopener noreferrer"
                className="button button-shopee"
              >
                Acessar Catálogo Geral na Shopee <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="section-head">
            <div>
              <p className="eyebrow">Encontre o que combina com seu treino</p>
              <h2 className="section-title" id="products-title">
                Explore por categoria
              </h2>
            </div>
            <p className="section-description">
              Produtos selecionados para treinar em casa, na academia e no seu
              ritmo.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="search-bar-container">
            <div className="search-input-wrapper">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar suplemento, equipamento, roupa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar produtos no catálogo"
              />
            </div>

            <div className="category-filter-pills" role="tablist">
              <button
                type="button"
                className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                Todos ({catalogData.reduce((a, c) => a + c.products.length, 0)})
              </button>
              {catalogData.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.title} ({cat.products.length})
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid Render */}
          {filteredCatalog.length > 0 ? (
            filteredCatalog.map((section) => (
              <CategorySection key={section.id} section={section} />
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--line)'
              }}
            >
              <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0 0 12px' }}>
                Nenhum produto encontrado para &quot;{searchTerm}&quot;.
              </p>
              <button
                type="button"
                className="filter-pill active"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>

        <Manifesto />
        <AboutSection />
        <SocialSection />
      </main>
      <Footer />
    </>
  );
}
