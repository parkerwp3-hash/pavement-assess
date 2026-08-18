import Screen from '../components/Screen.jsx'
import { totalSqft } from '../lib/useProperties.js'

const numberFormat = new Intl.NumberFormat('en-US')

function summarize(property) {
  const count = property.sections.length
  const sections = `${count} ${count === 1 ? 'section' : 'sections'}`
  const sqft = totalSqft(property)
  return sqft > 0
    ? `${sections} · ${numberFormat.format(sqft)} sq ft`
    : sections
}

export default function Properties({ properties, onNewProperty }) {
  return (
    <Screen id="properties" title="Properties" subtitle="Commercial sites on file">
      {properties.length === 0 ? (
        <div className="empty">
          <p className="empty-title">No properties yet</p>
          <p className="empty-body">
            Add a site and its lot sections before heading out to inspect.
          </p>
        </div>
      ) : (
        <ul className="property-list">
          {properties.map((property) => (
            <li key={property.id} className="property-item">
              <button type="button" className="property-button">
                <span className="property-name">{property.name}</span>
                <span className="property-meta">
                  {property.address ? `${property.address} · ` : ''}
                  {summarize(property)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="action-bar">
        <button type="button" className="button" onClick={onNewProperty}>
          New property
        </button>
      </div>
    </Screen>
  )
}
