export default function Header({ eyebrow, title, meta, action }) {
  return (
    <header className="header">
      <div className="container">
        {eyebrow ? <p className="header__eyebrow">{eyebrow}</p> : null}
        <div className="header__bar">
          <h1 className="header__title">{title}</h1>
          {action ? <div className="header__action">{action}</div> : null}
        </div>
        {meta ? <p className="header__meta">{meta}</p> : null}
      </div>
    </header>
  )
}
