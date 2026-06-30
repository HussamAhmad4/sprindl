export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-card__header">
        <h3 className="product-card__name">{product.name}</h3>
        <span className="product-card__tag">{product.bestFor}</span>
      </div>
      <div className="product-card__price">{product.priceRange}</div>
      <p className="product-card__specs">{product.specs}</p>
      {product.studentDiscount && (
        <a
          href={product.studentDiscountLink || '#'}
          target="_blank"
          rel="noreferrer"
          className="product-card__discount"
        >
          🎓 {product.studentDiscount}
        </a>
      )}
      <div className="product-card__actions">
        <a href={product.checkPriceLink} target="_blank" rel="noreferrer" className="btn btn--primary btn--small">
          Compare prices
        </a>
        <a href={product.amazonLink} target="_blank" rel="noreferrer" className="btn btn--ghost btn--small">
          Amazon
        </a>
      </div>
    </article>
  )
}
