import { useEffect, useState } from 'react'
import TabBar from './components/TabBar.jsx'
import Properties from './screens/Properties.jsx'
import Assess from './screens/Assess.jsx'
import Reports from './screens/Reports.jsx'
import NewProperty from './screens/NewProperty.jsx'
import PropertyDetail from './screens/PropertyDetail.jsx'
import { loadState, saveState } from './lib/storage.js'

export default function App() {
  const [properties, setProperties] = useState(() => loadState().properties)
  const [tab, setTab] = useState('properties')
  // Full-screen flows layered over the tabs: null | {type, id?}
  const [overlay, setOverlay] = useState(null)

  useEffect(() => {
    saveState({ properties })
  }, [properties])

  function handleSaveProperty(property) {
    setProperties((prev) => [property, ...prev])
    setOverlay(null)
  }

  function handleDeleteProperty(id) {
    setProperties((prev) => prev.filter((p) => p.id !== id))
    setOverlay(null)
  }

  if (overlay?.type === 'new-property') {
    return (
      <div className="app">
        <NewProperty
          onSave={handleSaveProperty}
          onCancel={() => setOverlay(null)}
        />
      </div>
    )
  }

  if (overlay?.type === 'property') {
    const property = properties.find((p) => p.id === overlay.id)
    if (property) {
      return (
        <div className="app">
          <PropertyDetail
            property={property}
            onBack={() => setOverlay(null)}
            onDelete={handleDeleteProperty}
          />
        </div>
      )
    }
  }

  return (
    <div className="app">
      {tab === 'properties' ? (
        <Properties
          properties={properties}
          onNewProperty={() => setOverlay({ type: 'new-property' })}
          onOpenProperty={(property) =>
            setOverlay({ type: 'property', id: property.id })
          }
        />
      ) : null}
      {tab === 'assess' ? <Assess propertyCount={properties.length} /> : null}
      {tab === 'reports' ? <Reports /> : null}

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
