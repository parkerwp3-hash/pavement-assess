const ICON_PROPS = {
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
  className: 'tab-icon',
}

function PropertiesIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M3 20h18" />
      <path d="M5 20V6l7-3 7 3v14" />
      <path d="M10 20v-5h4v5" />
    </svg>
  )
}

function AssessIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="3" y="4" width="18" height="16" rx="1" />
      <path d="M3 10h18" />
      <path d="M9 10v10" />
    </svg>
  )
}

function ReportsIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  )
}

export const TABS = [
  { id: 'properties', label: 'Properties', Icon: PropertiesIcon },
  { id: 'assess', label: 'Assess', Icon: AssessIcon },
  { id: 'reports', label: 'Reports', Icon: ReportsIcon },
]

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tab-bar" role="tablist" aria-label="Main">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          className="tab"
          aria-selected={active === id}
          aria-controls={`panel-${id}`}
          onClick={() => onChange(id)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  )
}
