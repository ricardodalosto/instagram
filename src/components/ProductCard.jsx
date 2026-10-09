'use client';

import { useState, useEffect, useRef } from 'react';

export default function ProductCard({ product }) {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    let isMounted = true;

    async function loadPrice() {
      if (loading || priceData) return;
      setLoading(true);

      try {
        const res = await fetch(`/api/prices?keyword=${encodeURIComponent(product.title)}`);
        const json = await res.json();

        if (isMounted) {
          if (res.ok && json.success && json.data) {
            setPriceData(json.data);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            loadPrice();
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(cardEl);

    return () => {
      isMounted = false;
      if (cardEl) observer.unobserve(cardEl);
    };
  }, [product.title]);

  const formattedPrice = priceData
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(priceData.priceMin)
    : null;

  const showMultiplePrices =
    priceData && priceData.priceMax && priceData.priceMax > priceData.priceMin;

  return (
    <article className="product" ref={cardRef} id={product.id}>
      <a
        className="product-art"
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver ${product.title} na Shopee`}
      >
        <img
          src={product.image}
          alt={product.alt || product.title}
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="product-info">
        <p className="product-type">{product.category}</p>
        <h3>
          <a href={product.link} target="_blank" rel="noopener noreferrer">
            {product.title}
          </a>
        </h3>

        <div className="product-price-box" aria-live="polite">
          {loading && (
            <span className="price-loading" title="Consultando preço na Shopee" />
          )}

          {!loading && priceData && (
            <>
              <span className="price-current">
                {showMultiplePrices ? `A partir de ${formattedPrice}` : formattedPrice}
              </span>
              {priceData.discount > 0 && (
                <span className="price-discount-badge">
                  -{Math.round(priceData.discount <= 1 ? priceData.discount * 100 : priceData.discount)}%
                </span>
              )}
            </>
          )}

          {!loading && (!priceData || error) && (
            <span className="price-badge-shopee">
              Confira o preço atual na Shopee
            </span>
          )}
        </div>

        <a
          className="text-link"
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver compra <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
