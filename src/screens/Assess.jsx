import Screen from '../components/Screen.jsx'

export default function Assess({ propertyCount }) {
  return (
    <Screen
      id="assess"
      title="Assess"
      subtitle="Walk a section and log distresses"
    >
      <div className="empty">
        <p className="empty-title">Assessment not built yet</p>
        <p className="empty-body">
          {propertyCount === 0
            ? 'Add a property first — assessments are recorded against a lot section.'
            : 'Pick a property and section here to record distress type, severity, and extent.'}
        </p>
      </div>
    </Screen>
  )
}
