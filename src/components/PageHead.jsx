/** The circle-marked heading every list screen opens with. */
export default function PageHead({ Icon, eyebrow, title, count, note, children }) {
  return (
    <div className="page-head">
      <span className="page-mark">
        <Icon size={30} />
      </span>
      <div>
        <div className="page-eyebrow">{eyebrow}</div>
        <h1 className="page-title">
          {title} {count != null ? <span className="page-count">({count})</span> : null}
        </h1>
        {note ? <div className="page-note">{note}</div> : null}
      </div>
      {children ? <div className="toolbar">{children}</div> : null}
    </div>
  )
}
