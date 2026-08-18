import { formatSqft, pluralize, totalSqft } from '../format.js'

export default function PropertyDetail({ property, onClose, onDelete }) {
  const area = totalSqft(property.sections)

  return (
    <section className="sheet" role="dialog" aria-modal="true" aria-label={property.name}>
      <div className="sheet__bar">
        <button type="button" className="sheet__action sheet__action--muted" onClick={onClose}>
          Close
        </button>
        <h2 className="sheet__title">Property</h2>
        <span className="sheet__action" aria-hidden="true" />
      </div>

      <div className="sheet__body">
        <h3 className="header__title">{property.name}</h3>
        <p className="header__meta">{property.address || 'No address recorded'}</p>

        <div className="section-head">
          <h4 className="section-head__title">Lot sections</h4>
          <span className="section-head__count">
            {pluralize(property.sections.length, 'section')}
          </span>
        </div>

        {property.sections.length > 0 ? (
          <ul className="detail-list">
            {property.sections.map((section) => (
              <li className="detail-list__item" key={section.id}>
                <span className="detail-list__name">{section.name}</span>
                <span className="detail-list__value">{formatSqft(section.sqft)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="field__hint">No sections were added for this property.</p>
        )}

        <div className="total-bar">
          <span className="total-bar__label">Total area</span>
          <span className="total-bar__value">
            {area > 0 ? area.toLocaleString('en-US') : '—'}
          </span>
        </div>

        <p className="field__hint">
          Assessment capture for these sections is not built yet.
        </p>
      </div>

      <div className="sheet__footer">
        <button type="button" className="btn btn--secondary" onClick={onDelete}>
          Delete property
        </button>
      </div>
    </section>
  )
}
