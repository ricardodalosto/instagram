export default function Hero() {
  return (
    <section className="wrap hero" aria-labelledby="hero-title">
      <div>
        <p className="eyebrow">Seu treino, do seu jeito</p>
        <h1 id="hero-title">
          Mais foco.<br />Mais <span>força.</span>
        </h1>
        <p className="hero-copy">
          Equipamentos, suplementos, roupas e acessórios para montar seu
          espaço de treino e seguir firme em cada repetição.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <a
            className="button button-shopee"
            href="https://collshp.com/dalosto?view=storefront"
            target="_blank"
            rel="noopener noreferrer"
          >
            Catálogo Geral na Shopee <span aria-hidden="true">↗</span>
          </a>
          <a className="button button-outline" href="#destaques">
            Ver Categorias <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="hero-note">
          <i aria-hidden="true"></i> Produtos selecionados para acompanhar seu ritmo
        </div>
      </div>

      <article className="feature">
        <div className="feature-copy">
          <span className="feature-tag">Destaque da loja</span>
          <h2>Treino completo em casa</h2>
          <p>
            Estação compacta com carga de 65 kg para trabalhar diferentes
            grupos musculares.
          </p>
          <a
            className="text-link"
            href="https://s.shopee.com.br/80D9vco8Zn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver oferta na Shopee <span aria-hidden="true">↗</span>
          </a>
        </div>
        <a
          className="feature-image"
          href="https://s.shopee.com.br/80D9vco8Zn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Comprar Estação de Musculação Gallant Elite X na Shopee"
        >
          <img
            src="/images/estacao-gallant.jpg"
            alt="Estação de musculação Gallant Elite X com torre de pesos, banco e puxadores"
            loading="lazy"
            decoding="async"
          />
        </a>
      </article>
    </section>
  );
}
