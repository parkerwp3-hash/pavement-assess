export default function Screen({ id, title, subtitle, full = false, children }) {
  return (
    <main
      id={id ? `panel-${id}` : undefined}
      role={id ? 'tabpanel' : undefined}
      className={full ? 'screen screen--full' : 'screen'}
    >
      <header className="screen-header">
        <h1 className="screen-title">{title}</h1>
        {subtitle && <p className="screen-subtitle">{subtitle}</p>}
      </header>
      {children}
    </main>
  )
}
