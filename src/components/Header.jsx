export default function Header({ eyebrow, title, meta }) {
  return (
    <header className="header">
      {eyebrow ? <p className="header__eyebrow">{eyebrow}</p> : null}
      <h1 className="header__title">{title}</h1>
      {meta ? <p className="header__meta">{meta}</p> : null}
    </header>
  )
}
