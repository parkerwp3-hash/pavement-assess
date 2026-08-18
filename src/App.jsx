import { useEffect, useMemo, useState } from 'react'
import TabBar from './components/TabBar.jsx'
import PropertiesScreen from './screens/PropertiesScreen.jsx'
import PropertyDetail from './screens/PropertyDetail.jsx'
import NewPropertyFlow from './screens/NewPropertyFlow.jsx'
import AssessScreen from './screens/AssessScreen.jsx'
import ReportsScreen from './screens/ReportsScreen.jsx'
import { loadProperties, saveProperties } from './lib/storage.js'

export default function App() {
  const [tab, setTab] = useState('properties')
  const [properties, setProperties] = useState(loadProperties)
  const [isCreating, setIsCreating] = useState(false)
  const [openPropertyId, setOpenPropertyId] = useState(null)

  useEffect(() => {
    saveProperties(properties)
  }, [properties])

  const openProperty = useMemo(
    () => properties.find((p) => p.id === openPropertyId) || null,
    [properties, openPropertyId],
  )

  function handleSave(property) {
    setProperties((prev) => [property, ...prev])
    setIsCreating(false)
  }

  function handleDelete(id) {
    setProperties((prev) => prev.filter((p) => p.id !== id))
    setOpenPropertyId(null)
  }

  return (
    <div className="app">
      {tab === 'properties' ? (
        <PropertiesScreen
          properties={properties}
          onNewProperty={() => setIsCreating(true)}
          onOpenProperty={setOpenPropertyId}
        />
      ) : null}
      {tab === 'assess' ? <AssessScreen /> : null}
      {tab === 'reports' ? <ReportsScreen /> : null}

      <TabBar active={tab} onChange={setTab} />

      {openProperty ? (
        <PropertyDetail
          property={openProperty}
          onBack={() => setOpenPropertyId(null)}
          onDelete={handleDelete}
        />
      ) : null}

      {isCreating ? (
        <NewPropertyFlow
          onCancel={() => setIsCreating(false)}
          onSave={handleSave}
        />
      ) : null}
    </div>
  )
}
