document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.product'));
  const loadedCards = new Set();
  const refreshIntervalMs = 15 * 60 * 1000;
  const apiBase = document.querySelector('meta[name="rd-store-api"]')
    ?.content.trim().replace(/\/+$/, '') || '';

  function getPriceBox(card) {
    const info = card.querySelector('.product-info');
    const link = info?.querySelector('.text-link');
    if (!info || !link) return null;

    let box = info.querySelector('.product-price-box');
    if (!box) {
      box = document.createElement('div');
      box.className = 'product-price-box';
      box.setAttribute('aria-live', 'polite');
      info.insertBefore(box, link);
    }
    return box;
  }

  async function updatePrice(card) {
    const box = getPriceBox(card);
    const title = card.querySelector('h3')?.textContent.trim();
    if (!box || !title) return;

    box.replaceChildren();
    const loading = document.createElement('span');
    loading.className = 'price-loading';
    loading.title = 'Consultando preço na Shopee';
    box.append(loading);

    try {
      const response = await fetch(`${apiBase}/api/prices?keyword=${encodeURIComponent(title)}`, {
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || `Erro HTTP ${response.status}`);
      }

      const { priceMin, priceMax, discount } = result.data;
      const current = Number(priceMin);
      const maximum = Number(priceMax);
      if (!Number.isFinite(current) || current <= 0) {
        throw new Error('A API retornou um preço inválido.');
      }

      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      const price = document.createElement('span');
      price.className = 'price-current';
      price.textContent = Number.isFinite(maximum) && maximum > current
        ? `A partir de ${formatted.format(current)}`
        : formatted.format(current);
      box.append(price);

      const discountPercent = Number(discount);
      if (Number.isFinite(discountPercent) && discountPercent > 0) {
        const badge = document.createElement('span');
        badge.className = 'price-discount-badge';
        badge.textContent = `-${Math.round(discountPercent <= 1 ? discountPercent * 100 : discountPercent)}%`;
        box.append(badge);
      }

      loadedCards.add(card);
    } catch (error) {
      console.error(`Não foi possível atualizar o preço de "${title}":`, error);
      box.replaceChildren();
      const fallback = document.createElement('span');
      fallback.className = 'price-badge-shopee';
      fallback.textContent = 'Confira o preço atual na Shopee';
      box.append(fallback);
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          updatePrice(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    cards.forEach((card) => observer.observe(card));
  } else {
    cards.forEach(updatePrice);
  }

  window.setInterval(() => {
    loadedCards.forEach(updatePrice);
  }, refreshIntervalMs);
});
