import { BellIcon, GearIcon } from '../components/Icons.jsx'

export default function TopBar() {
  return (
    <div className="topbar">
      <button type="button" className="topbar-btn" aria-label="Notifications">
        <BellIcon />
        <span className="topbar-dot" />
      </button>
      <button type="button" className="topbar-btn" aria-label="Settings">
        <GearIcon />
      </button>
      <span className="topbar-sep" />
      <span className="avatar" aria-label="Signed in as Dana Reyes">
        DR
      </span>
    </div>
  )
}
