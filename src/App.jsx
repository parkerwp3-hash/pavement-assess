import { useState } from 'react'
import TabBar from './components/TabBar.jsx'
import Properties from './screens/Properties.jsx'
import NewProperty from './screens/NewProperty.jsx'
import Assess from './screens/Assess.jsx'
import Reports from './screens/Reports.jsx'
import { useProperties } from './lib/useProperties.js'

export default function App() {
  const [tab, setTab] = useState('properties')
  const [creating, setCreating] = useState(false)
  const { properties, addProperty } = useProperties()

  // The new-property flow takes over the viewport — one task, no tab bar.
  if (creating) {
    return (
      <div className="app">
        <NewProperty
          onCancel={() => setCreating(false)}
          onSave={(draft) => {
            addProperty(draft)
            setCreating(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="app">
      {tab === 'properties' && (
        <Properties
          properties={properties}
          onNewProperty={() => setCreating(true)}
        />
      )}
      {tab === 'assess' && <Assess propertyCount={properties.length} />}
      {tab === 'reports' && <Reports />}

      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
