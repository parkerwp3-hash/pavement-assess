import Screen from '../components/Screen.jsx'
import Placeholder from '../components/Placeholder.jsx'

export default function ReportsScreen() {
  return (
    <Screen
      id="reports"
      title="Reports"
      subtitle="Condition summaries and repair scopes"
    >
      <Placeholder badge="Coming next">
        Completed assessments will roll up into a condition report with
        recommended treatments and estimated quantities.
      </Placeholder>
    </Screen>
  )
}
