import { useMemo, useState } from 'react'
import PageHead from '../components/PageHead.jsx'
import Pagination from '../components/Pagination.jsx'
import Toolbar from '../components/Toolbar.jsx'
import {
  AestheticsIcon,
  ConditionIcon,
  FunctionIcon,
  KebabIcon,
  LiabilityIcon,
  PlusIcon,
  PortfolioIcon,
  StarIcon,
} from '../components/Icons.jsx'
import { formatDate, formatSqFt } from '../lib/format.js'

const RATING_MARKS = [
  { key: 'function', Icon: FunctionIcon, label: 'Function' },
  { key: 'liability', Icon: LiabilityIcon, label: 'Liability' },
  { key: 'aesthetics', Icon: AestheticsIcon, label: 'Aesthetics' },
  { key: 'condition', Icon: ConditionIcon, label: 'Pavement condition' },
]

const TONE_FOR = { function: 'good', liability: 'bad', aesthetics: 'warn', condition: 'mid' }

function RatingMarks({ site }) {
  return (
    <span className="reccard-marks">
      {RATING_MARKS.map(({ key, Icon, label }) => {
        const rating = site.ratings?.[key]
        return (
          <span
            key={key}
            className={`ratingdot ratingdot--${rating?.tone || TONE_FOR[key]}`}
            title={rating ? `${label}: ${rating.label}` : `${label}: not assessed`}
            style={rating ? undefined : { opacity: 0.35 }}
          >
            <Icon />
          </span>
        )
      })}
    </span>
  )
}

export default function PortfolioScreen({
  sites,
  onOpen,
  onNew,
  onToggleStar,
}) {
  const [view, setView] = useState('card')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sites
    return sites.filter((site) =>
      [site.name, site.address, site.id, site.region]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [sites, query])

  // A filter that shortens the list can strand the viewer past the last page.
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pageCount)
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize)

  return (
    <>
      <PageHead
        Icon={PortfolioIcon}
        eyebrow="My Portfolio"
        title="All Properties"
        count={sites.length}
        note={`${filtered.length} shown`}
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
              <PortfolioIcon size={40} />
              <h2 className="empty-title">
                {sites.length === 0 ? 'No properties yet' : 'No matches'}
              </h2>
              <p className="empty-text">
                {sites.length === 0
                  ? 'Add a property and lay out its lot sections before you head out to inspect.'
                  : 'No property matches that search.'}
              </p>
              {sites.length === 0 ? (
                <button type="button" className="btn" onClick={onNew}>
                  <PlusIcon />
                  New Property
                </button>
              ) : null}
            </div>
          ) : (
            visible.map((site) => {
              const pkg = site.projectPackages?.[0]
              return (
                <div className="reccard" key={site.id}>
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
                      ID: <b>{site.id}</b>
                    </div>
                    <div>
                      Project Status:{' '}
                      <b>{pkg ? `${pkg.name} / ${pkg.priorityScore}%` : 'None'}</b>
                    </div>
                    <div>
                      Last Inspection:{' '}
                      <b>{site.inspectionDate ? formatDate(site.inspectionDate) : 'None'}</b>
                    </div>
                    {view === 'list' ? null : (
                      <div>
                        Paved area: <b>{formatSqFt(site.surfaceAreas.totalPavedSF)}</b>
                      </div>
                    )}
                  </div>

                  <div className="reccard-side">
                    <RatingMarks site={site} />
                    <button
                      type="button"
                      className={site.highPriority ? 'star star--on' : 'star'}
                      aria-label={
                        site.highPriority ? 'Remove high priority' : 'Mark high priority'
                      }
                      aria-pressed={site.highPriority}
                      onClick={() => onToggleStar(site.id)}
                    >
                      <StarIcon filled={site.highPriority} />
                    </button>
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

      {filtered.length > 0 ? (
        <Pagination
          page={current}
          pageSize={pageSize}
          total={filtered.length}
          onPage={setPage}
          onPageSize={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      ) : null}

      <button type="button" className="btn fab" onClick={onNew}>
        <PlusIcon />
        New Property
      </button>
    </>
  )
}
