import { IconAssess, IconProperties, IconReports } from './Icons.jsx'

const TABS = [
  { id: 'properties', label: 'Properties', Icon: IconProperties },
  { id: 'assess', label: 'Assess', Icon: IconAssess },
  { id: 'reports', label: 'Reports', Icon: IconReports },
]

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar" role="tablist" aria-label="Sections">
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
          <Icon className="tab__icon" />
          <span>{label}</span>
          <span className="tab__rule" />
        </button>
      ))}
    </nav>
  )
}
