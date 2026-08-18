import { AssessIcon, PropertiesIcon, ReportsIcon } from './Icons.jsx'

export const TABS = [
  { id: 'properties', label: 'Properties', Icon: PropertiesIcon },
  { id: 'assess', label: 'Assess', Icon: AssessIcon },
  { id: 'reports', label: 'Reports', Icon: ReportsIcon },
]

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar" role="tablist" aria-label="Main">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          id={`tab-${id}`}
          aria-selected={active === id}
          aria-controls={`panel-${id}`}
          className="tab"
          onClick={() => onChange(id)}
        >
          <Icon className="tab-icon" />
          <span className="tab-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
