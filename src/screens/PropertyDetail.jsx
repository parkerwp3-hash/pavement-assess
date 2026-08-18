import { useState } from 'react'
import Header from '../components/Header.jsx'
import { formatNumber, totalSquareFeet } from '../lib/properties.js'

export default function PropertyDetail({ property, onBack, onDelete }) {
  const total = totalSquareFeet(property)
  // Two taps to delete — a mis-tap in the field shouldn't lose a survey.
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <div className="screen screen--plain">
      <Header
        eyebrow="Property"
        title={property.name}
        meta={property.address || undefined}
        action={
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            Done
          </button>
        }
      />

      <div className="container">
        <h2 className="subhead">Lot sections</h2>

        {property.sections.length === 0 ? (
          <p className="placeholder__body">No sections recorded.</p>
        ) : (
          <ul className="list">
            {property.sections.map((section) => (
              <li className="list__item" key={section.id}>
                <div className="property property--static">
                  <h3 className="property__name">{section.name || 'Untitled section'}</h3>
                  <p className="property__stats">
                    {section.squareFeet === null
                      ? 'Square footage not set'
                      : `${formatNumber(section.squareFeet)} sq ft`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {total > 0 ? (
          <p className="total-row">Total · {formatNumber(total)} sq ft</p>
        ) : null}

        <div className="list-footer">
          {confirmingDelete ? (
            <>
              <p className="field__hint">
                Delete {property.name} and its sections? This can’t be undone.
              </p>
              <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={() => onDelete(property.id)}
              >
                Yes, delete property
              </button>
              <button
                type="button"
                className="btn btn--block btn--stacked"
                onClick={() => setConfirmingDelete(false)}
              >
                Keep property
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn--block"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete property
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
