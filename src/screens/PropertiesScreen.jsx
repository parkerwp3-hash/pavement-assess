import Screen from '../components/Screen.jsx'
import { ChevronRightIcon, PlusIcon, PropertiesIcon } from '../components/Icons.jsx'
import { formatSqFt, pluralize } from '../lib/format.js'
import { FACILITY_TYPES, labelFor } from '../lib/taxonomy.js'

function totalSqFt(property) {
  return (property.sections || []).reduce((sum, s) => sum + (s.sqft || 0), 0)
}

function EmptyState({ onNewProperty }) {
  return (
    <div className="empty">
      <PropertiesIcon size={40} className="empty-mark" />
      <h2 className="empty-title">No properties yet</h2>
      <p className="empty-text">
        Add a property and lay out its lot sections before you head out to
        inspect.
      </p>
      <div className="empty-actions">
        <button type="button" className="btn" onClick={onNewProperty}>
          <PlusIcon />
          New property
        </button>
      </div>
    </div>
  )
}

export default function PropertiesScreen({
  properties,
  onNewProperty,
  onOpenProperty,
}) {
  const hasProperties = properties.length > 0

  return (
    <Screen
      id="properties"
      title="Properties"
      subtitle={
        hasProperties ? pluralize(properties.length, 'property', 'properties') : null
      }
      flush={hasProperties}
    >
      {hasProperties ? (
        <>
          <div className="list">
            {properties.map((property) => {
              const sectionCount = (property.sections || []).length
              return (
                <button
                  key={property.id}
                  type="button"
                  className="row"
                  onClick={() => onOpenProperty(property.id)}
                >
                  <span className="row-main">
                    <span className="row-title">{property.name}</span>
                    <span className="row-meta">
                      {labelFor(FACILITY_TYPES, property.facilityType)}
                    </span>
                    <span className="row-sub">
                      {pluralize(sectionCount, 'section')} ·{' '}
                      {formatSqFt(totalSqFt(property))}
                    </span>
                  </span>
                  {/* Scores arrive with the assessment screen. The slot is here
                      now so the row does not reflow once they do. */}
                  <span className="score" aria-label="Condition score not yet assessed">
                    <span className="score-value">—</span>
                    <span className="score-label">PCI</span>
                  </span>
                  <ChevronRightIcon className="row-chevron" />
                </button>
              )
            })}
          </div>
          <div className="list-footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onNewProperty}
            >
              <PlusIcon />
              New property
            </button>
          </div>
        </>
      ) : (
        <EmptyState onNewProperty={onNewProperty} />
      )}
    </Screen>
  )
}
