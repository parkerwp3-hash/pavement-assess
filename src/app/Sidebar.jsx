import {
  PortfolioIcon,
  ProjectsIcon,
  ProposalsIcon,
  SignOutIcon,
  SupportIcon,
} from '../components/Icons.jsx'

export const NAV = [
  { id: 'portfolio', label: 'Portfolio', Icon: PortfolioIcon },
  { id: 'proposals', label: 'Proposals', Icon: ProposalsIcon },
  { id: 'projects', label: 'Projects', Icon: ProjectsIcon },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <nav className="sidebar" aria-label="Main">
      <div className="brand">
        <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
          <path
            d="M17 2l15 15-15 15L2 17z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
          />
          <path d="M17 8.5l8.5 8.5L17 25.5 8.5 17z" fill="#00aeef" />
        </svg>
        <span>
          <span className="brand-name">DIAMOND</span>
          <span className="brand-sub">SOLUTIONS</span>
        </span>
      </div>

      <div className="nav">
        {NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={active === id ? 'nav-item nav-item--on' : 'nav-item'}
            aria-current={active === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>

      <div className="nav-foot">
        <hr className="nav-rule" />
        <button type="button" className="nav-item">
          <SupportIcon />
          Customer Service
        </button>
        <button type="button" className="nav-item">
          <SignOutIcon />
          Sign Out
        </button>
      </div>
    </nav>
  )
}
