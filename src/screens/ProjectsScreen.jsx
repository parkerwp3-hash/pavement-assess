import { useMemo, useState } from 'react'
import PageHead from '../components/PageHead.jsx'
import Pagination from '../components/Pagination.jsx'
import Toolbar from '../components/Toolbar.jsx'
import { KebabIcon, PlusIcon, ProjectsIcon, StarIcon } from '../components/Icons.jsx'
import { formatMoney } from '../lib/format.js'

/**
 * Project packages across every site.
 *
 * A package's stage is derived from its status rather than stored twice —
 * two fields that can disagree about the same fact will eventually disagree.
 */
const STAGE = {
  proposed: { label: 'Kickoff', percent: 5 },
  awaiting_approval: { label: 'Awaiting Approval', percent: 15 },
  scheduled: { label: 'Scheduling', percent: 35 },
  executing: { label: 'Executing', percent: 75 },
  on_hold: { label: 'On Hold', percent: null },
  complete: { label: 'Complete', percent: 100 },
}

export default function ProjectsScreen({ sites, onOpen }) {
  const [view, setView] = useState('card')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  const rows = useMemo(() => {
    const all = sites.flatMap((site) =>
      (site.projectPackages || []).map((pkg) => ({ site, pkg })),
    )
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter(({ site, pkg }) =>
      `${site.name} ${site.address} ${pkg.id} ${pkg.name}`.toLowerCase().includes(q),
    )
  }, [sites, query])

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pageCount)
  const visible = rows.slice((current - 1) * pageSize, current * pageSize)

  return (
    <>
      <PageHead
        Icon={ProjectsIcon}
        eyebrow="Projects"
        title="All Projects"
        count={rows.length}
        note={`${rows.length} package${rows.length === 1 ? '' : 's'} across ${sites.length} propert${sites.length === 1 ? 'y' : 'ies'}`}
      >
        <Toolbar
          view={view}
          onView={setView}
          query={query}
          onQuery={(value) => {
            setQuery(value)
            setPage(1)
          }}
          placeholder="Search by Property name, ID"
        />
      </PageHead>

      <div className="panel">
        <div className="panel-body panel-body--tight">
          {visible.length === 0 ? (
            <div className="empty">
              <ProjectsIcon size={40} />
              <h2 className="empty-title">No projects yet</h2>
              <p className="empty-text">
                Project packages are created from the repair zones recorded during
                an assessment.
              </p>
            </div>
          ) : (
            visible.map(({ site, pkg }) => {
              const stage = STAGE[pkg.status] || STAGE.proposed
              return (
                <div className="reccard" key={`${site.id}-${pkg.id}`}>
                  <button
                    type="button"
                    className="reccard-name"
                    onClick={() => onOpen(site.id)}
                  >
                    <span className="reccard-title">{site.name}</span>
                    <span className="reccard-addr">{site.address || '—'}</span>
                  </button>

                  <div className="reccard-facts">
                    <div>
                      ID: <b>{pkg.id}</b>
                    </div>
                    <div>
                      Package: <b>{pkg.name}</b>
                    </div>
                    <div>
                      Recommended: <b>{pkg.recommendedYear || 'TBD'}</b> · Value:{' '}
                      <b>{formatMoney(pkg.currentCustomerPrice)}</b>
                    </div>
                  </div>

                  <div className="reccard-side">
                    <span className="statuspill">
                      {stage.label}
                      {stage.percent == null ? '' : ` / ${stage.percent}%`}
                    </span>
                    {site.highPriority ? (
                      <span className="star star--on" aria-label="High priority">
                        <StarIcon filled />
                      </span>
                    ) : null}
                    <button type="button" className="kebab" aria-label="More actions">
                      <KebabIcon />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {rows.length > 0 ? (
        <Pagination
          page={current}
          pageSize={pageSize}
          total={rows.length}
          onPage={setPage}
          onPageSize={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      ) : null}

      <button type="button" className="btn fab">
        <PlusIcon />
        New Request
      </button>
    </>
  )
}
