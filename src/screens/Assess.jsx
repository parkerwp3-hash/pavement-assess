import Header from '../components/Header.jsx'

export default function Assess({ propertyCount }) {
  return (
    <div className="screen">
      <Header
        eyebrow="Pavement Assess"
        title="Assess"
        meta={
          propertyCount === 0
            ? 'Add a property first'
            : 'Select a property to begin a walk'
        }
      />

      <div className="container">
        <div className="placeholder">
          <div className="placeholder__rule" />
          <h2 className="placeholder__title">Field assessment</h2>
          <p className="placeholder__body">
            Section-by-section condition capture goes here — distress type,
            severity, extent, and photos, scored per section.
          </p>
          <ul className="placeholder__list">
            <li>Pick property and section</li>
            <li>Log distresses with severity and extent</li>
            <li>Attach photos and notes</li>
            <li>Roll up to a section condition rating</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
