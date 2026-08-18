import { useEffect, useState } from 'react'
import TabBar from './components/TabBar.jsx'
import Assess from './screens/Assess.jsx'
import NewProperty from './screens/NewProperty.jsx'
import Properties from './screens/Properties.jsx'
import PropertyDetail from './screens/PropertyDetail.jsx'
import Reports from './screens/Reports.jsx'
import { loadState, saveState } from './storage.js'

export default function App() {
  const [tab, setTab] = useState('properties')
  const [properties, setProperties] = useState(() => loadState().properties)
  const [sheet, setSheet] = useState(null) // null | {type:'new'} | {type:'detail', id}

  useEffect(() => {
    saveState({ properties })
  }, [properties])

  const openProperty = sheet?.type === 'detail'
    ? properties.find((property) => property.id === sheet.id)
    : null

  function handleSave(property) {
    setProperties((prev) => [property, ...prev])
    setSheet(null)
  }

  function handleDelete(id) {
    setProperties((prev) => prev.filter((property) => property.id !== id))
    setSheet(null)
  }

  return (
    <div className="app">
      <main
        className="screen"
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
      >
        {tab === 'properties' ? (
          <Properties
            properties={properties}
            onNewProperty={() => setSheet({ type: 'new' })}
            onOpenProperty={(id) => setSheet({ type: 'detail', id })}
          />
        ) : null}
        {tab === 'assess' ? <Assess /> : null}
        {tab === 'reports' ? <Reports /> : null}
      </main>

      <TabBar active={tab} onChange={setTab} />

      {sheet?.type === 'new' ? (
        <NewProperty onCancel={() => setSheet(null)} onSave={handleSave} />
      ) : null}

      {openProperty ? (
        <PropertyDetail
          property={openProperty}
          onClose={() => setSheet(null)}
          onDelete={() => handleDelete(openProperty.id)}
        />
      ) : null}
    </div>
  )
}
