import Screen from '../components/Screen.jsx'
import Placeholder from '../components/Placeholder.jsx'

export default function AssessScreen() {
  return (
    <Screen
      id="assess"
      title="Assess"
      subtitle="Record distresses section by section"
    >
      <Placeholder badge="Coming next">
        Pick a property and walk its sections, logging pavement distresses,
        severity, and photos as you go.
      </Placeholder>
    </Screen>
  )
}
