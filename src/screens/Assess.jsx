import Header from '../components/Header.jsx'

export default function Assess() {
  return (
    <>
      <Header eyebrow="Pavement Assess" title="Assess" />
      <div className="placeholder">
        <span className="placeholder__tag">Not built yet</span>
        <h2 className="placeholder__title">Section-by-section capture</h2>
        <p className="placeholder__text">
          This is where a section is walked and scored — distress type, severity,
          extent, and photos — one lot section at a time.
        </p>
      </div>
    </>
  )
}
