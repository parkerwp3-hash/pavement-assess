import { useEffect, useMemo, useState } from 'react'
import Sidebar from './app/Sidebar.jsx'
import TopBar from './app/TopBar.jsx'
import PortfolioScreen from './screens/PortfolioScreen.jsx'
import ProposalsScreen from './screens/ProposalsScreen.jsx'
import ProjectsScreen from './screens/ProjectsScreen.jsx'
import PropertyDetailScreen from './screens/PropertyDetailScreen.jsx'
import NewPropertyFlow from './screens/NewPropertyFlow.jsx'
import { loadSites, saveSites } from './lib/schema.js'

export default function App() {
  const [section, setSection] = useState('portfolio')
  const [sites, setSites] = useState(loadSites)
  const [openSiteId, setOpenSiteId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    saveSites(sites)
  }, [sites])

  const openSite = useMemo(
    () => sites.find((site) => site.id === openSiteId) || null,
    [sites, openSiteId],
  )

  function navigate(next) {
    setSection(next)
    // Leaving a section closes whatever record was open under it.
    setOpenSiteId(null)
  }

  function handleSave(site) {
    setSites((prev) => [site, ...prev])
    setIsCreating(false)
  }

  function handleDelete(id) {
    setSites((prev) => prev.filter((site) => site.id !== id))
    setOpenSiteId(null)
  }

  function toggleStar(id) {
    setSites((prev) =>
      prev.map((site) =>
        site.id === id ? { ...site, highPriority: !site.highPriority } : site,
      ),
    )
  }

  function openFromAnySection(id) {
    setSection('portfolio')
    setOpenSiteId(id)
  }

  return (
    <div className="app">
      <Sidebar active={section} onNavigate={navigate} />

      <div className="main">
        <TopBar />

        <main className="content">
          {openSite ? (
            <PropertyDetailScreen
              site={openSite}
              onBack={() => setOpenSiteId(null)}
              onDelete={handleDelete}
            />
          ) : (
            <>
              {section === 'portfolio' ? (
                <PortfolioScreen
                  sites={sites}
                  onOpen={setOpenSiteId}
                  onNew={() => setIsCreating(true)}
                  onToggleStar={toggleStar}
                />
              ) : null}
              {section === 'proposals' ? (
                <ProposalsScreen sites={sites} onOpen={openFromAnySection} />
              ) : null}
              {section === 'projects' ? (
                <ProjectsScreen sites={sites} onOpen={openFromAnySection} />
              ) : null}
            </>
          )}
        </main>

        <footer className="footer">Copyrights © 2026 Diamond Solutions</footer>
      </div>

      {isCreating ? (
        <NewPropertyFlow
          onCancel={() => setIsCreating(false)}
          onSave={handleSave}
        />
      ) : null}
    </div>
  )
}
