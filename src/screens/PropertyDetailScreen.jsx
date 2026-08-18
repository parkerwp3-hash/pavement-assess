import { useState } from 'react'
import SiteMap from '../components/SiteMap.jsx'
import {
  AestheticsIcon,
  ActivityIcon,
  ChevronLeftIcon,
  ConditionIcon,
  DocIcon,
  FunctionIcon,
  LiabilityIcon,
  MoneyIcon,
  PhotoIcon,
  PortfolioIcon,
  StarIcon,
  TrowelIcon,
} from '../components/Icons.jsx'
import {
  CLIMATE_ZONES,
  DISTRESS_TYPES,
  FACILITY_TYPES,
  SEVERITIES,
  TRAFFIC_CLASSES,
  TREATMENTS,
  labelFor,
} from '../lib/taxonomy.js'
import {
  formatDate,
  formatDateTime,
  formatMoney,
  formatNumber,
  formatSqFt,
} from '../lib/format.js'
import { totalRepairPrice } from '../lib/schema.js'

const STAGES = ['Gather Information', 'Evaluate Property', 'Design Solution', 'Present Proposal']

const RATING_ROWS = [
  { key: 'function', label: 'Function', Icon: FunctionIcon },
  { key: 'liability', label: 'Liability', Icon: LiabilityIcon },
  { key: 'aesthetics', label: 'Aesthetics', Icon: AestheticsIcon },
  { key: 'condition', label: 'Pavement Condition', Icon: ConditionIcon },
]

function Panel({ title, action, onAction, children, tight }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h2 className="panel-title">{title}</h2>
        {action ? (
          <button type="button" className="panel-link" onClick={onAction}>
            {action}
          </button>
        ) : null}
      </div>
      <div className={tight ? 'panel-body panel-body--tight' : 'panel-body'}>
        {children}
      </div>
    </div>
  )
}

export default function PropertyDetailScreen({ site, onBack, onDelete }) {
  const [selectedZone, setSelectedZone] = useState(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const zones = site.repairZones || []
  const packages = site.projectPackages || []
  const repairTotal = totalRepairPrice(site)

  return (
    <>
      <button type="button" className="btn btn--plain" onClick={onBack}>
        <ChevronLeftIcon size={18} />
        Back to portfolio
      </button>

      <div className="hero" style={{ marginTop: 'var(--s4)' }}>
        <span className="hero-mark">
          <PortfolioIcon size={30} />
        </span>
        <div className="hero-main">
          <h1 className="hero-title">{site.name}</h1>
          <p className="hero-sub">
            {site.address || '—'}
            {site.region ? ` · ${site.region}` : ''}
            {site.clientId ? ` · ${site.clientId}` : ''}
          </p>

          <dl className="hero-facts">
            <div>
              <dt>Facility Type: </dt>
              <dd>{labelFor(FACILITY_TYPES, site.facilityType)}</dd>
            </div>
            <div>
              <dt>Inspection Date: </dt>
              <dd>{formatDate(site.inspectionDate)}</dd>
            </div>
            <div>
              <dt>Asphalt Sq Ft: </dt>
              <dd>{formatNumber(site.surfaceAreas.asphaltSF)}</dd>
            </div>
            <div>
              <dt>Traffic Class: </dt>
              <dd>{labelFor(TRAFFIC_CLASSES, site.trafficClass)}</dd>
            </div>
            <div>
              <dt>Concrete Sq Ft: </dt>
              <dd>{formatNumber(site.surfaceAreas.concreteSF)}</dd>
            </div>
            <div>
              <dt>Climate Zone: </dt>
              <dd>{labelFor(CLIMATE_ZONES, site.climateZone)}</dd>
            </div>
            <div>
              <dt>Total Paved: </dt>
              <dd>{formatSqFt(site.surfaceAreas.totalPavedSF)}</dd>
            </div>
            <div>
              <dt>Identified Repairs: </dt>
              <dd>{formatMoney(repairTotal)}</dd>
            </div>
          </dl>

          {site.mockData ? (
            <p style={{ marginTop: 'var(--s3)' }}>
              <span className="demo-flag">Demo data — not a real survey</span>
            </p>
          ) : null}
        </div>

        {site.highPriority ? (
          <span className="hero-flag">
            <StarIcon filled size={18} />
            High Priority
          </span>
        ) : null}
      </div>

      <div className="detail-grid">
        <div>
          <SiteMap site={site} selectedId={selectedZone} onSelect={setSelectedZone} />

          <Panel title="Current Project Status">
            <div className="stepper">
              {STAGES.map((label, index) => {
                const step = index + 1
                const state =
                  step < site.projectStage
                    ? 'done'
                    : step === site.projectStage
                      ? 'now'
                      : 'todo'
                return (
                  <div className={`stepper-node stepper-node--${state}`} key={label}>
                    <span className="stepper-dot">
                      {state === 'done' ? '✓' : String(step).padStart(2, '0')}
                    </span>
                    <span className="stepper-label">{label}</span>
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title={`Repair Zones (${zones.length})`} tight>
            {zones.length === 0 ? (
              <div className="empty">
                <p className="empty-text">No repair zones recorded yet.</p>
              </div>
            ) : (
              zones.map((zone) => (
                <button
                  type="button"
                  key={zone.id}
                  className={
                    zone.id === selectedZone ? 'zonerow zonerow--on' : 'zonerow'
                  }
                  onClick={() =>
                    setSelectedZone(zone.id === selectedZone ? null : zone.id)
                  }
                >
                  <span className="zonerow-id">{zone.id}</span>
                  <span className="zonerow-main">
                    <span className="zonerow-title">
                      {labelFor(DISTRESS_TYPES, zone.distressType)}{' '}
                      <span className={`tag tag--${zone.severity}`}>
                        {labelFor(SEVERITIES, zone.severity)}
                      </span>
                    </span>
                    <span className="zonerow-meta">
                      {labelFor(TREATMENTS, zone.recommendedTreatment)} ·{' '}
                      {formatNumber(zone.quantity)} {zone.unit} ·{' '}
                      {zone.linkedProjectPackageId || 'unassigned'}
                      {zone.id === selectedZone && zone.modeledAssumptions.nextLikelyTreatment
                        ? ` · if deferred: ${labelFor(TREATMENTS, zone.modeledAssumptions.nextLikelyTreatment)} (${zone.modeledAssumptions.projectionConfidence} confidence)`
                        : ''}
                    </span>
                  </span>
                  <span className="zonerow-price">
                    {formatMoney(zone.currentCustomerPrice)}
                  </span>
                </button>
              ))
            )}
          </Panel>

          <Panel title="Photos" action="View All">
            <div className="photogrid">
              {Array.from({ length: 10 }, (_, i) => (
                <div className="phototile" key={i}>
                  <PhotoIcon />
                </div>
              ))}
            </div>
            <p style={{ marginTop: 'var(--s3)', fontSize: 13, color: 'var(--ink-faint)' }}>
              Photo capture arrives with the Assess flow; these are placeholders.
            </p>
          </Panel>

          <Panel title="Recent Activities" action="View All" tight>
            {(site.activities || []).length === 0 ? (
              <div className="empty">
                <p className="empty-text">No activity recorded yet.</p>
              </div>
            ) : (
              [...site.activities]
                .sort((a, b) => String(b.at).localeCompare(String(a.at)))
                .map((entry) => (
                  <div className="itemrow" key={entry.id}>
                    <span className="itemrow-icon">
                      <ActivityIcon />
                    </span>
                    <span className="itemrow-main">
                      <span className="itemrow-title">{entry.title}</span>
                      <span className="itemrow-meta">{formatDateTime(entry.at)}</span>
                    </span>
                    <button type="button" className="panel-link">
                      View Detail
                    </button>
                  </div>
                ))
            )}
          </Panel>
        </div>

        <div>
          <Panel title="Property Team" action="Add New" tight>
            {site.team.length === 0 ? (
              <p className="empty-text" style={{ padding: 'var(--s3)' }}>
                No team members yet.
              </p>
            ) : (
              site.team.map((person) => (
                <div className="itemrow" key={person.id}>
                  <span className="itemrow-icon">
                    {person.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <span className="itemrow-main">
                    <span className="itemrow-title">{person.name}</span>
                    <span className="itemrow-meta">{person.role}</span>
                    <span className="itemrow-meta">{person.email}</span>
                    <span className="itemrow-meta">{person.phone}</span>
                  </span>
                </div>
              ))
            )}
          </Panel>

          <Panel title="Projects" action="Add New" tight>
            {packages.length === 0 ? (
              <p className="empty-text" style={{ padding: 'var(--s3)' }}>
                No project packages yet.
              </p>
            ) : (
              packages.map((pkg) => (
                <div className="itemrow" key={pkg.id}>
                  <span className="itemrow-icon">
                    <TrowelIcon />
                  </span>
                  <span className="itemrow-main">
                    <span className="itemrow-title">{pkg.id}</span>
                    <span className="itemrow-meta">{pkg.name}</span>
                    <span className="itemrow-meta">
                      {pkg.recommendedYear} · Priority {pkg.priorityScore} ·{' '}
                      {formatMoney(pkg.currentCustomerPrice)}
                    </span>
                  </span>
                  {pkg.status === 'awaiting_approval' ? (
                    <button type="button" className="btn btn--go">
                      Approve
                    </button>
                  ) : null}
                </div>
              ))
            )}
          </Panel>

          <Panel title="Pavement Ratings" tight>
            {RATING_ROWS.map(({ key, label, Icon }) => {
              const rating = site.ratings?.[key]
              return (
                <div className="itemrow" key={key}>
                  <span
                    className={`ratingdot ratingdot--${rating?.tone || 'good'}`}
                    style={rating ? undefined : { opacity: 0.35 }}
                  >
                    <Icon />
                  </span>
                  <span className="itemrow-main">
                    <span className="itemrow-title">{label}</span>
                    <span className="itemrow-meta">
                      Assessment Date: {rating ? formatDate(rating.date) : '—'}
                    </span>
                    <span className="itemrow-meta">
                      {rating ? rating.label : 'Not assessed'}
                    </span>
                  </span>
                </div>
              )
            })}
          </Panel>

          <Panel title="Budgets" action="Add New" tight>
            {site.budgets.length === 0 ? (
              <p className="empty-text" style={{ padding: 'var(--s3)' }}>
                No budgets yet.
              </p>
            ) : (
              site.budgets.map((budget) => {
                const delta = budget.budget - budget.actual
                return (
                  <div className="itemrow" key={budget.id}>
                    <span className="itemrow-icon">
                      <MoneyIcon />
                    </span>
                    <span className="itemrow-main">
                      <span className="itemrow-title">{budget.year}</span>
                      <span className="itemrow-meta">
                        Budget: {formatMoney(budget.budget)}
                      </span>
                      <span className="itemrow-meta">
                        Actual: {formatMoney(budget.actual)}
                      </span>
                      <span className="itemrow-meta">
                        {delta >= 0 ? 'Remaining: ' : 'Variance: '}
                        <span className={delta >= 0 ? 'money-good' : 'money-bad'}>
                          {delta >= 0
                            ? formatMoney(delta)
                            : `(${formatMoney(Math.abs(delta))})`}
                        </span>
                      </span>
                    </span>
                  </div>
                )
              })
            )}
          </Panel>

          <Panel title="Documents" action="View All" tight>
            {site.documents.length === 0 ? (
              <p className="empty-text" style={{ padding: 'var(--s3)' }}>
                No documents yet.
              </p>
            ) : (
              site.documents.map((doc) => (
                <div className="itemrow" key={doc.id}>
                  <span className="itemrow-icon">
                    <DocIcon />
                  </span>
                  <span className="itemrow-main">
                    <span className="itemrow-title">{doc.title}</span>
                    <span className="itemrow-meta">Date: {formatDate(doc.date)}</span>
                    <span className="itemrow-meta">
                      Amount: {formatMoney(doc.amount)}
                    </span>
                    <span className="itemrow-meta">Status: {doc.status}</span>
                  </span>
                </div>
              ))
            )}
          </Panel>

          <Panel title="Danger Zone">
            {confirmingDelete ? (
              <>
                <p style={{ marginBottom: 'var(--s3)', color: 'var(--ink-muted)' }}>
                  Delete {site.name}, its {zones.length} repair zones and{' '}
                  {packages.length} packages? This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={() => onDelete(site.id)}
                  >
                    Delete permanently
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Keep property
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setConfirmingDelete(true)}
              >
                Delete property
              </button>
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}
