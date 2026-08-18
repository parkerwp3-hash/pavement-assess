import { useEffect, useMemo, useState } from 'react'
import Sidebar from './app/Sidebar.jsx'
import Portfolio from './pages/Portfolio.jsx'
import SiteDetail from './pages/SiteDetail.jsx'
import { exportJSON, importJSON, loadState, resetState, saveState } from './lib/store.js'

function DataModal({ mode, state, onApply, onClose }) {
  const [text, setText] = useState(mode === 'export' ? exportJSON(state) : '')
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  function handleImport() {
    const result = importJSON(text)
    if (result.error) setError(result.error)
    else onApply(result.state)
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setText(String(reader.result))
    reader.readAsText(file)
    e.target.value = ''
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setError('Clipboard unavailable — select the text and copy manually.')
    }
  }

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-label={`${mode} data`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <h2>{mode === 'export' ? 'Export JSON' : 'Import JSON'}</h2>
        {mode === 'export' ? (
          <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            Full lab state — sites, zones, packages, assumptions, uploads. Copy it out; the viewer sandbox
            blocks direct file downloads.
          </p>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            Paste exported JSON (or choose a file). Importing replaces the current sites and assumptions.
          </p>
        )}
        <textarea className="input" value={text} readOnly={mode === 'export'} spellCheck={false}
          onChange={(e) => { setText(e.target.value); setError(null) }} aria-label="JSON payload" />
        {error ? <p style={{ color: 'var(--critical)', fontWeight: 600, fontSize: 13 }}>{error}</p> : null}
        <div className="field-row">
          {mode === 'export' ? (
            <button className="btn btn--primary" onClick={copy}>{copied ? 'Copied ✓' : 'Copy to clipboard'}</button>
          ) : (
            <>
              <button className="btn" onClick={() => document.getElementById('import-file').click()}>
                Choose file…
              </button>
              <input id="import-file" type="file" accept="application/json,.json" hidden onChange={handleFile} />
              <button className="btn btn--primary" disabled={!text.trim()} onClick={handleImport}>Import</button>
            </>
          )}
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [state, setState] = useState(loadState)
  const [page, setPage] = useState('portfolio')
  const [siteId, setSiteId] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  const site = useMemo(
    () => state.sites.find((s) => s.id === siteId) || null,
    [state.sites, siteId],
  )

  function openSite(id) {
    setSiteId(id)
    setPage('site')
  }

  function updateSite(next) {
    setState((prev) => ({
      ...prev,
      sites: prev.sites.map((s) => (s.id === next.id ? next : s)),
    }))
  }

  function handleReset() {
    if (window.confirm('Reset all data to the demo seed? Edits, overrides and uploads will be lost.')) {
      setState(resetState())
      setSiteId(null)
      setPage('portfolio')
    }
  }

  const navItems = [
    ['portfolio', 'Portfolio'],
    ['site', site ? site.name : 'Site Detail'],
    ['lab', 'Model Lab'],
  ]

  return (
    <div className="app">
      <Sidebar
        items={[
          { id: 'portfolio', label: 'Portfolio', icon: 'portfolio' },
          { id: 'site', label: 'Site Detail', icon: 'site', disabled: !site },
        ]}
        active={page}
        onNavigate={setPage}
      />

      <div className="main">
        <header className="topbar">
          <span className="topbar-title">Diamond Portfolio Decision Lab</span>
          <span className="mock-badge">MOCK DATA</span>
          <span className="topbar-actions">
            <button className="btn btn--sm" onClick={() => setModal('import')}>Import JSON</button>
            <button className="btn btn--sm" onClick={() => setModal('export')}>Export JSON</button>
            <button className="btn btn--sm btn--danger" onClick={handleReset}>Reset Demo Data</button>
          </span>
        </header>

        <main className="content">
          {page === 'portfolio' ? (
            <Portfolio sites={state.sites} onOpenSite={openSite} />
          ) : null}
          {page === 'site' && site ? (
            <SiteDetail key={site.id} site={site}
              onBack={() => setPage('portfolio')} onUpdateSite={updateSite} />
          ) : null}
        </main>

        <footer className="footer">Copyrights © 2026 Diamond Solutions · Product-discovery prototype, mock data only</footer>
      </div>

      {modal ? (
        <DataModal mode={modal} state={state} onClose={() => setModal(null)}
          onApply={(next) => { setState(next); setModal(null); setSiteId(null); setPage('portfolio') }} />
      ) : null}
    </div>
  )
}
