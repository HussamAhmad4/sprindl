import { useState } from 'react'
import ResourceCard from './ResourceCard.jsx'
import ProductCard from './ProductCard.jsx'
import CampusProgramCard from './CampusProgramCard.jsx'
import ResultsFilter from './ResultsFilter.jsx'

function parseMinPrice(priceRange) {
  if (!priceRange) return Infinity
  const clean = priceRange.replace(/[^0-9.%]/g, ' ').trim()
  const nums = clean.match(/\d+(\.\d+)?/g)
  if (!nums) return 0
  return parseFloat(nums[0])
}

function sortProducts(products, sort) {
  if (!products?.length) return products
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => parseMinPrice(a.priceRange) - parseMinPrice(b.priceRange))
  if (sort === 'price-desc') return copy.sort((a, b) => parseMinPrice(b.priceRange) - parseMinPrice(a.priceRange))
  if (sort === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name))
  return copy
}

export default function MessageBubble({ message, bookmarkHandlers }) {
  const isUser = message.role === 'user'
  const [sort, setSort] = useState('default')

  const sortedProducts = sortProducts(message.products, sort)
  const { add, remove, isBookmarked } = bookmarkHandlers || {}

  const mkBookmark = (type, item) => ({
    onBookmark: add
      ? () => {
          const name = item.name || item.id
          if (isBookmarked(name)) {
            remove(bookmarkHandlers.bookmarks?.find((b) => b.data?.name === name || b.data?.id === name)?.id)
          } else {
            add(type, item)
          }
        }
      : null,
    isBookmarked: isBookmarked ? isBookmarked(item.name || item.id) : false,
  })

  return (
    <div className={`message ${isUser ? 'message--user' : 'message--assistant'}`}>
      {!isUser && <div className="message__avatar" aria-hidden="true">S</div>}
      <div className="message__content">
        <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--assistant'}`}>{message.content}</div>
        {!isUser && message.followUp && <div className="follow-up">{message.followUp}</div>}

        {!isUser && sortedProducts?.length > 0 && (
          <>
            <ResultsFilter sort={sort} onChange={setSort} count={sortedProducts.length} />
            <div className="result-list">
              {sortedProducts.map((p, i) => (
                <ProductCard key={i} product={p} {...mkBookmark('deal', p)} />
              ))}
            </div>
          </>
        )}

        {!isUser && message.resources?.length > 0 && (
          <div className="result-grid">
            {message.resources.map((r) => (
              <ResourceCard key={r.id} resource={r} {...mkBookmark('resource', r)} />
            ))}
          </div>
        )}

        {!isUser && message.programs?.length > 0 && (
          <div className="result-list">
            {message.programs.map((p, i) => (
              <CampusProgramCard key={i} program={p} {...mkBookmark('program', p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
