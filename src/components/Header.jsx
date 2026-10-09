'use client';

export default function Header() {
  return (
    <>
      <div className="topline">
        <a
          href="https://collshp.com/dalosto?view=storefront"
          target="_blank"
          rel="noopener noreferrer"
          className="topline-link"
          aria-label="Visite minha loja na RD Store"
        >
          Visite minha loja <span aria-hidden="true">↗</span>
        </a>
      </div>
      <header>
        <div className="wrap nav">
          <a className="brand" href="#inicio" aria-label="RD Store, início">
            <span className="brand-mark">RD <strong>STORE</strong></span>
          </a>
          <nav className="primary-nav" aria-label="Navegação principal">
            <a href="#equipamentos">Equipamentos</a>
            <a href="#suplementos">Suplementos</a>
            <a href="#roupas">Roupas</a>
            <a href="#acessorios">Acessórios</a>
            <a href="#sobre">A história do Ricardo</a>
            <a href="#redes-sociais">Redes Sociais</a>
          </nav>
          <a className="nav-cta" href="#destaques">
            Ver produtos <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
      <div className="developer-ribbon">
        <div className="wrap developer-credit">
          <img
            className="developer-portrait"
            src="/images/eu.jpeg"
            alt="Ricardo, desenvolvedor do site"
          />
          <p>
            Desenvolvido por Ricardo
            <span>Idealizador da RD Store</span>
          </p>
        </div>
      </div>
    </>
  );
}
