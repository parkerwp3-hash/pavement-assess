import Header from '../components/Header.jsx'
import {
  formatNumber,
  pluralize,
  totalSquareFeet,
} from '../lib/properties.js'

function PropertyRow({ property, onOpen }) {
  const total = totalSquareFeet(property)
  const sectionCount = property.sections.length

  return (
    <li className="list__item">
      <button type="button" className="property" onClick={() => onOpen(property)}>
        <h2 className="property__name">{property.name}</h2>
        {property.address ? (
          <p className="property__address">{property.address}</p>
        ) : null}
        <p className="property__stats">
          {pluralize(sectionCount, 'section', 'sections')}
          {total > 0 ? ` · ${formatNumber(total)} sq ft` : ''}
        </p>
      </button>
    </li>
  )
}

export default function Properties({ properties, onNewProperty, onOpenProperty }) {
  const hasProperties = properties.length > 0

  return (
    <div className="screen">
      <Header
        eyebrow="Pavement Assess"
        title="Properties"
        meta={
          hasProperties
            ? pluralize(properties.length, 'property', 'properties')
            : undefined
        }
      />

      <div className="container">
        {hasProperties ? (
          <>
            <ul className="list">
              {properties.map((property) => (
                <PropertyRow
                  key={property.id}
                  property={property}
                  onOpen={onOpenProperty}
                />
              ))}
            </ul>
            <div className="list-footer">
              <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={onNewProperty}
              >
                New property
              </button>
            </div>
          </>
        ) : (
          <div className="empty">
            <h2 className="empty__title">No properties yet</h2>
            <p className="empty__body">
              Add a property to record its lot sections, then walk each section
              and log surface condition.
            </p>
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={onNewProperty}
            >
              New property
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
