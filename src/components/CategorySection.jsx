import ProductCard from './ProductCard';

export default function CategorySection({ section }) {
  return (
    <section
      className="category-section"
      id={section.id}
      aria-labelledby={`${section.id}-title`}
    >
      <div className="category-heading">
        {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
        <h3 className="section-title" id={`${section.id}-title`}>
          {section.title}
        </h3>
      </div>
      <div className="products">
        {section.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
