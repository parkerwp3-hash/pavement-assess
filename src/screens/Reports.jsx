import Screen from '../components/Screen.jsx'

export default function Reports() {
  return (
    <Screen id="reports" title="Reports" subtitle="Findings and repair estimates">
      <div className="empty">
        <p className="empty-title">Reports not built yet</p>
        <p className="empty-body">
          Completed assessments will roll up here into a condition summary you can
          hand to the property owner.
        </p>
      </div>
    </Screen>
  )
}
