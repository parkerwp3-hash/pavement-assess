/** Black Diamond Solutions sidebar; collapses to a bottom tab bar on phones. */

function DiamondMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 34 34" aria-hidden="true">
      <path d="M17 2l15 15-15 15L2 17z" fill="none" stroke="#ffffff" strokeWidth="2.5" />
      <path d="M17 8.5l8.5 8.5L17 25.5 8.5 17z" fill="#00aeef" />
    </svg>
  )
}

function NavIcon({ kind }) {
  const paths = {
    portfolio: <><path d="M3 20h18" /><path d="M5 20V6h9v14" /><path d="M14 20V10h5v10" /><path d="M8 10h3M8 14h3" /></>,
    site: <><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></>,
    lab: <><path d="M10 3v6l-5 9a2 2 0 001.8 3h10.4a2 2 0 001.8-3l-5-9V3" /><path d="M8 3h8M8.5 14h7" /></>,
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  )
}

export default function Sidebar({ items, active, onNavigate }) {
  return (
    <nav className="sidebar" aria-label="Main">
      <div className="brand">
        <DiamondMark />
        <span>
          <span className="brand-name">DIAMOND</span>
          <span className="brand-sub">SOLUTIONS</span>
        </span>
      </div>
      <span className="mock-badge">MOCK DATA</span>

      <div className="nav">
        {items.map(({ id, label, icon, disabled }) => (
          <button key={id} type="button"
            className={active === id ? 'nav-item nav-item--on' : 'nav-item'}
            aria-current={active === id ? 'page' : undefined}
            disabled={disabled}
            onClick={() => onNavigate(id)}>
            <NavIcon kind={icon} />
            {label}
          </button>
        ))}
      </div>

      <div className="nav-foot">
        <hr className="nav-rule" />
        <button type="button" className="nav-item">Customer Service</button>
        <button type="button" className="nav-item">Sign Out</button>
      </div>
    </nav>
  )
}
