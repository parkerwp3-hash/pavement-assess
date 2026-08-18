export default function Placeholder({ badge, children }) {
  return (
    <div className="placeholder">
      <span className="placeholder-badge">{badge}</span>
      <p className="placeholder-text">{children}</p>
    </div>
  )
}
