import { ChevronLeftIcon } from '../components/Icons.jsx'
import { formatSqFt, pluralize } from '../lib/format.js'

export default function PropertyDetail({ property, onBack, onDelete }) {
  const sections = property.sections || []
  const total = sections.reduce((sum, s) => sum + (s.sqft || 0), 0)

  return (
    <div className="flow">
      <header className="flow-header">
        <button
          type="button"
          className="icon-btn"
          onClick={onBack}
          aria-label="Back to properties"
        >
          <ChevronLeftIcon />
        </button>
        <h2 className="flow-title">{property.name}</h2>
      </header>

      <div className="flow-body" style={{ padding: 0 }}>
        <div className="detail-block">
          <div className="detail-label">Address</div>
          <div className="detail-value">
            {property.address || '—'}
          </div>
        </div>

        <div className="detail-block">
          <div className="detail-label">
            Lot sections · {pluralize(sections.length, 'section')}
          </div>
          {sections.length === 0 ? (
            <div className="detail-value">No sections recorded.</div>
          ) : (
            <div className="list" style={{ marginTop: 'var(--s3)' }}>
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="row"
                  style={{ paddingLeft: 0, paddingRight: 0, cursor: 'default' }}
                >
                  <span className="row-main">
                    <span className="row-title">{section.name}</span>
                    <span className="row-meta">{formatSqFt(section.sqft)}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="total-line">
            <span>Total area</span>
            <span className="total-line-value">{formatSqFt(total)}</span>
          </div>
        </div>

        <div className="detail-block">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => onDelete(property.id)}
          >
            Delete property
          </button>
        </div>
      </div>
    </div>
  )
}
