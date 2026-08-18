const ICON = {
  common: {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: false,
    className: 'tab__icon',
  },
}

function PropertiesIcon() {
  return (
    <svg {...ICON.common}>
      <path d="M3 20h18" />
      <path d="M5 20V7l7-4 7 4v13" />
      <path d="M10 20v-5h4v5" />
    </svg>
  )
}

function AssessIcon() {
  return (
    <svg {...ICON.common}>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M4 10h16" />
      <path d="M10 10v10" />
      <path d="M7 7h.01M13 14h.01M16 17h.01" />
    </svg>
  )
}

function ReportsIcon() {
  return (
    <svg {...ICON.common}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  )
}

const TABS = [
  { id: 'properties', label: 'Properties', Icon: PropertiesIcon },
  { id: 'assess', label: 'Assess', Icon: AssessIcon },
  { id: 'reports', label: 'Reports', Icon: ReportsIcon },
]

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar" aria-label="Primary">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className="tab"
          aria-current={active === id ? 'page' : undefined}
          onClick={() => onChange(id)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  )
}
