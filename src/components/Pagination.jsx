import { ChevronLeftIcon, ChevronRightIcon } from './Icons.jsx'

/** Page numbers with an ellipsis once the run gets long. */
function pageList(total) {
  if (total <= 4) return Array.from({ length: total }, (_, i) => i + 1)
  return [1, 2, 3, '…', total]
}

export default function Pagination({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
  sizes = [6, 15, 30],
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <div className="pager">
      <span>
        Showing {first} to{' '}
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          aria-label="Rows per page"
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>{' '}
        of {total} items
      </span>

      <div className="pager-pages">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <ChevronLeftIcon size={18} />
        </button>
        {pageList(pages).map((entry, index) =>
          entry === '…' ? (
            <button key={`gap-${index}`} type="button" disabled>
              …
            </button>
          ) : (
            <button
              key={entry}
              type="button"
              aria-current={entry === page ? 'page' : undefined}
              onClick={() => onPage(entry)}
            >
              {entry}
            </button>
          ),
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
        >
          <ChevronRightIcon size={18} />
        </button>
      </div>
    </div>
  )
}
