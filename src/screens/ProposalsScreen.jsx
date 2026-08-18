import { useMemo, useState } from 'react'
import PageHead from '../components/PageHead.jsx'
import Pagination from '../components/Pagination.jsx'
import Toolbar from '../components/Toolbar.jsx'
import { KebabIcon, PlusIcon, ProposalsIcon, StarIcon } from '../components/Icons.jsx'
import { formatDate, formatMoney } from '../lib/format.js'

const STATUS_LABEL = {
  proposed: 'Evaluating / 55%',
  awaiting_approval: 'Awaiting Approval / 85%',
  scheduled: 'Scheduling / 55%',
  executing: 'Executing / 85%',
  complete: 'Complete',
}

/** Proposals are project packages seen from the commercial side. */
export default function ProposalsScreen({ sites, onOpen }) {
  const [view, setView] = useState('list')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

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
        Icon={ProposalsIcon}
        eyebrow="Proposals"
        title="All Proposals"
        count={rows.length}
        note={`${rows.length} proposal${rows.length === 1 ? '' : 's'}`}
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

      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              <th scope="col" style={{ width: 44 }}>
                <input type="checkbox" aria-label="Select all proposals" />
              </th>
              <th scope="col" style={{ width: 44 }}>
                <span className="sr-only">Priority</span>
              </th>
              <th scope="col">ID #</th>
              <th scope="col">Property Name</th>
              <th scope="col">Address</th>
              <th scope="col">Requested On</th>
              <th scope="col">Value</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty">
                    <ProposalsIcon size={40} />
                    <h2 className="empty-title">No proposals yet</h2>
                    <p className="empty-text">
                      Proposals are raised from the project packages an assessment
                      produces.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              visible.map(({ site, pkg }) => (
                <tr key={`${site.id}-${pkg.id}`}>
                  <td>
                    <input type="checkbox" aria-label={`Select ${pkg.id}`} />
                  </td>
                  <td>
                    {site.highPriority ? (
                      <span className="star star--on" aria-label="High priority">
                        <StarIcon filled size={18} />
                      </span>
                    ) : (
                      <span className="star" aria-hidden="true">
                        <StarIcon size={18} />
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="cell-link"
                      onClick={() => onOpen(site.id)}
                    >
                      {pkg.id}
                    </button>
                  </td>
                  <td>{site.name}</td>
                  <td>{site.address || '—'}</td>
                  <td>{formatDate(site.inspectionDate)}</td>
                  <td>{formatMoney(pkg.currentCustomerPrice)}</td>
                  <td>{STATUS_LABEL[pkg.status] || 'Evaluating / 55%'}</td>
                  <td>
                    <button type="button" className="kebab" aria-label="More actions">
                      <KebabIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
          sizes={[15, 30, 50]}
        />
      ) : null}

      <button type="button" className="btn fab">
        <PlusIcon />
        New Request
      </button>
    </>
  )
}
