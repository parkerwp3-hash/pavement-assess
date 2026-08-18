import Header from '../components/Header.jsx'

export default function Reports() {
  return (
    <div className="screen">
      <Header eyebrow="Pavement Assess" title="Reports" meta="Nothing to report yet" />

      <div className="container">
        <div className="placeholder">
          <div className="placeholder__rule" />
          <h2 className="placeholder__title">Client deliverables</h2>
          <p className="placeholder__body">
            Completed assessments are compiled here into a condition summary
            with recommended treatments and budget ranges.
          </p>
          <ul className="placeholder__list">
            <li>Condition summary by section</li>
            <li>Recommended treatment and priority</li>
            <li>Budget estimate by square foot</li>
            <li>Export as PDF</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
