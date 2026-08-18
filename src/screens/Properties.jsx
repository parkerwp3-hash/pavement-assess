import Header from '../components/Header.jsx'
import { IconChevron, IconPlus, IconProperties } from '../components/Icons.jsx'
import { formatSqft, pluralize, totalSqft } from '../format.js'

function EmptyState({ onNewProperty }) {
  return (
    <div className="empty">
      <div className="empty__mark">
        <IconProperties size={32} />
      </div>
      <h2 className="empty__title">No properties yet</h2>
      <p className="empty__text">
        Add a property to define its lot sections. Assessments and reports are
        organized under the property they belong to.
      </p>
      <div className="empty__actions">
        <button type="button" className="btn" onClick={onNewProperty}>
          <IconPlus size={20} />
          New property
        </button>
      </div>
    </div>
  )
}

export default function Properties({ properties, onNewProperty, onOpenProperty }) {
  const hasProperties = properties.length > 0

  return (
    <>
      <Header
        eyebrow="Pavement Assess"
        title="Properties"
        meta={
          hasProperties
            ? `${pluralize(properties.length, 'property', 'properties')} stored on this device`
            : undefined
        }
      />

      {hasProperties ? (
        <>
          <ul className="list">
            {properties.map((property) => {
              const area = totalSqft(property.sections)
              return (
                <li className="list__item" key={property.id}>
                  <button
                    type="button"
                    className="row"
                    onClick={() => onOpenProperty(property.id)}
                  >
                    <span className="row__main">
                      <span className="row__title">{property.name}</span>
                      <span className="row__sub">
                        {property.address || 'No address'}
                      </span>
                      <span className="row__sub">
                        {pluralize(property.sections.length, 'section')} ·{' '}
                        {area > 0 ? formatSqft(area) : 'Area not set'}
                      </span>
                    </span>
                    <IconChevron className="row__chevron" size={20} />
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="body">
            <button type="button" className="btn btn--secondary" onClick={onNewProperty}>
              <IconPlus size={20} />
              New property
            </button>
          </div>
        </>
      ) : (
        <EmptyState onNewProperty={onNewProperty} />
      )}
    </>
  )
}
