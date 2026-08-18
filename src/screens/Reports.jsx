import Header from '../components/Header.jsx'

export default function Reports() {
  return (
    <>
      <Header eyebrow="Pavement Assess" title="Reports" />
      <div className="placeholder">
        <span className="placeholder__tag">Not built yet</span>
        <h2 className="placeholder__title">Condition summaries</h2>
        <p className="placeholder__text">
          Completed assessments will roll up here into a per-property condition
          summary with repair recommendations and estimated quantities.
        </p>
      </div>
    </>
  )
}
