export default function Screen({ id, title, subtitle, action, flush, children }) {
  return (
    <section
      className="screen"
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
    >
      <header className="screen-header">
        <h1 className="screen-title">{title}</h1>
        {subtitle ? <p className="screen-subtitle">{subtitle}</p> : null}
        {action}
      </header>
      <div className={flush ? 'screen-body screen-body--flush' : 'screen-body'}>
        {children}
      </div>
    </section>
  )
}
