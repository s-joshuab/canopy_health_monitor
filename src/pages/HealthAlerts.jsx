import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BellRing,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  MapPin,
  Satellite,
  Search,
  SearchX,
  SlidersHorizontal,
  TriangleAlert,
  X,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Select from '../components/ui/Select'
import Sparkline from '../components/charts/Sparkline'
import { useToast } from '../components/ui/toastContext'
import { alerts as initialAlerts, severityOptions } from '../data/alerts'
import { provinceOptions } from '../data/provinces'
import {
  alertStatusStyles,
  severityStyles,
} from '../lib/status'
import { cn } from '../lib/utils'

const tabStatuses = [
  { value: 'all', label: 'All' },
  { value: 'Open', label: 'Open' },
  { value: 'Acknowledged', label: 'Acknowledged' },
  { value: 'Resolved', label: 'Resolved' },
]

function AlertDrawer({
  alert,
  onClose,
  onAcknowledge,
  onResolve,
  onAssign,
  onViewMap,
}) {
  const [checkedActions, setCheckedActions] = useState([])

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const severity = severityStyles[alert.severity]
  const startValue = alert.trend[0]
  const endValue = alert.trend[alert.trend.length - 1]
  const delta = endValue - startValue

  const toggleAction = (index) => {
    setCheckedActions((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close alert detail"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[460px] animate-slide-in flex-col border-l border-line bg-panel shadow-[-16px_0_48px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-subtle">
                {alert.id}
              </span>
              <Badge className={severity.badge} dot dotClassName={severity.dot}>
                {alert.severity}
              </Badge>
              <Badge className={alertStatusStyles[alert.status]}>
                {alert.status}
              </Badge>
            </div>
            <h2 className="mt-2 text-[15px] font-medium leading-6 text-ink">
              {alert.title}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted">
              <MapPin className="h-3 w-3" />
              {alert.barangay}, {alert.municipality}, {alert.province}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-button -mr-2 -mt-1 h-7 w-7"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-[12px] leading-5 text-muted">{alert.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 rounded-md border border-line bg-canvas/50 p-3.5">
            <div>
              <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                Area affected
              </p>
              <p className="mt-1 font-mono text-[16px] text-ink">
                {alert.areaHa} ha
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                Confidence
              </p>
              <p className="mt-1 font-mono text-[16px] text-ink">
                {alert.confidence.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                Current NDVI
              </p>
              <p
                className={cn(
                  'mt-1 font-mono text-[16px]',
                  alert.ndvi < 0.45
                    ? 'text-health-degraded'
                    : 'text-health-moderate',
                )}
              >
                {alert.ndvi.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                NDVI change
              </p>
              <p className="mt-1 font-mono text-[16px] text-health-deforested">
                {alert.ndviDelta.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-line p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-subtle">
                NDVI trajectory
              </p>
              <span className="font-mono text-[9px] text-subtle">
                10 composites
              </span>
            </div>
            <Sparkline
              data={alert.trend}
              color={severity.color}
              width={360}
              height={74}
              className="mt-2 w-full"
            />
            <div className="mt-1 flex items-center justify-between font-mono text-[9px] text-subtle">
              <span>{startValue.toFixed(2)}</span>
              <span
                className={cn(
                  delta < 0 ? 'text-health-deforested' : 'text-brand',
                )}
              >
                {delta > 0 ? '+' : ''}
                {delta.toFixed(2)} pts
              </span>
              <span>{endValue.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-line pt-4">
            <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-subtle">
              Detection details
            </p>
            <div className="mt-2.5 space-y-2 text-[11px]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-subtle">Detected</span>
                <span className="font-mono text-[10px] text-ink">
                  {alert.detected}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-subtle">Coordinates</span>
                <span className="font-mono text-[10px] text-ink">
                  {alert.coordinateLabel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-subtle">Satellite</span>
                <span className="text-ink">{alert.satellite}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-subtle">Scene</span>
                <span className="truncate font-mono text-[9px] text-ink">
                  {alert.sceneId}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-subtle">Assigned to</span>
                <span className="text-ink">{alert.assignedTo}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-subtle">
                Recommended actions
              </p>
              <span className="font-mono text-[9px] text-subtle">
                {checkedActions.length}/{alert.actions.length}
              </span>
            </div>
            <div className="mt-2.5 space-y-2">
              {alert.actions.map((action, index) => (
                <label
                  key={action}
                  className="flex cursor-pointer items-start gap-2.5 rounded-md border border-line bg-canvas/30 px-2.5 py-2 transition hover:bg-elevated/60"
                >
                  <input
                    type="checkbox"
                    checked={checkedActions.includes(index)}
                    onChange={() => toggleAction(index)}
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-line bg-canvas accent-brand"
                  />
                  <span
                    className={cn(
                      'text-[11px] leading-4',
                      checkedActions.includes(index)
                        ? 'text-subtle line-through'
                        : 'text-muted',
                    )}
                  >
                    {action}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-[9px] text-subtle">
            <Satellite className="h-3 w-3" />
            Scene acquired {alert.detectedShort} · model ResNet-50 v2.4.1
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onViewMap}
            className="flex-1"
          >
            <MapPin className="h-3 w-3" />
            View on map
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onAssign}
            className="flex-1"
          >
            Assign to me
          </Button>
          {alert.status === 'Open' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onAcknowledge}
              className="flex-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              Acknowledge
            </Button>
          ) : alert.status === 'Acknowledged' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onResolve}
              className="flex-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              Resolve
            </Button>
          ) : (
            <Button variant="secondary" size="sm" disabled className="flex-1">
              Resolved
            </Button>
          )}
        </div>
      </aside>
    </div>
  )
}

export default function HealthAlerts() {
  const location = useLocation()
  const navigate = useNavigate()
  const { push } = useToast()
  const [alertRows, setAlertRows] = useState(initialAlerts)
  const [statusFilter, setStatusFilter] = useState('all')
  const [severity, setSeverity] = useState(
    location.state?.severity || 'all',
  )
  const [province, setProvince] = useState(
    location.state?.provinceId || 'all',
  )
  const [search, setSearch] = useState('')
  const [selectedAlertId, setSelectedAlertId] = useState(null)

  const selectedAlert = alertRows.find(
    (alert) => alert.id === selectedAlertId,
  )

  const statusCounts = useMemo(
    () => ({
      all: alertRows.length,
      Open: alertRows.filter((alert) => alert.status === 'Open').length,
      Acknowledged: alertRows.filter(
        (alert) => alert.status === 'Acknowledged',
      ).length,
      Resolved: alertRows.filter((alert) => alert.status === 'Resolved').length,
    }),
    [alertRows],
  )

  const openCount = statusCounts.Open
  const criticalCount = alertRows.filter(
    (alert) => alert.severity === 'Critical' && alert.status !== 'Resolved',
  ).length

  const filteredAlerts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return alertRows.filter((alert) => {
      const matchesStatus =
        statusFilter === 'all' || alert.status === statusFilter
      const matchesSeverity =
        severity === 'all' || alert.severity === severity
      const matchesProvince =
        province === 'all' || alert.provinceId === province
      const matchesSearch =
        !term ||
        `${alert.id} ${alert.title} ${alert.type} ${alert.municipality} ${alert.province}`
          .toLowerCase()
          .includes(term)
      return (
        matchesStatus &&
        matchesSeverity &&
        matchesProvince &&
        matchesSearch
      )
    })
  }, [alertRows, province, search, severity, statusFilter])

  const clearFilters = () => {
    setStatusFilter('all')
    setSeverity('all')
    setProvince('all')
    setSearch('')
  }

  const updateStatus = (id, status) => {
    setAlertRows((rows) =>
      rows.map((alert) => (alert.id === id ? { ...alert, status } : alert)),
    )
    push(`Alert marked ${status.toLowerCase()}`, {
      description: `${id} · ${status === 'Resolved' ? 'Moved to resolved' : 'Review assigned'}`,
    })
  }

  const assignToMe = (id) => {
    setAlertRows((rows) =>
      rows.map((alert) =>
        alert.id === id
          ? { ...alert, assignedTo: 'Joshua Sacquiaten' }
          : alert,
      ),
    )
    push('Alert assigned to you', {
      description: `${id} · Joshua Sacquiaten`,
    })
  }

  const columns = [
    {
      key: 'alert',
      header: 'Alert',
      render: (row) => (
        <div className="min-w-[220px]">
          <p className="font-mono text-[9px] text-subtle">{row.id}</p>
          <p className="mt-0.5 text-[12px] font-medium text-ink">
            {row.title}
          </p>
          <p className="mt-0.5 text-[10px] text-subtle">{row.type}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (row) => (
        <div className="min-w-[150px]">
          <p className="text-[11px] text-ink">{row.municipality}</p>
          <p className="mt-0.5 text-[10px] text-subtle">{row.province}</p>
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (row) => (
        <Badge
          className={severityStyles[row.severity].badge}
          dot
          dotClassName={severityStyles[row.severity].dot}
        >
          {row.severity}
        </Badge>
      ),
    },
    {
      key: 'detected',
      header: 'Detected',
      className: 'whitespace-nowrap font-mono text-[10px]',
      render: (row) => row.detected,
    },
    {
      key: 'areaHa',
      header: 'Area',
      className: 'font-mono text-[10px] text-ink',
      render: (row) => `${row.areaHa} ha`,
    },
    {
      key: 'confidence',
      header: 'Confidence',
      className: 'font-mono text-[10px]',
      render: (row) => `${row.confidence.toFixed(1)}%`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge className={alertStatusStyles[row.status]}>{row.status}</Badge>
      ),
    },
    {
      key: 'open',
      header: '',
      headerClassName: 'w-8',
      render: () => (
        <ChevronRight className="h-3.5 w-3.5 text-subtle transition group-hover:text-ink" />
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Health Alerts"
        meta={
          <Badge
            className="border-health-deforested/30 bg-health-deforested/10 text-health-deforested"
            dot
            dotClassName="bg-health-deforested"
          >
            {openCount} open
          </Badge>
        }
        description="Review and triage vegetation health anomalies detected across the Ilocos Region."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => navigate('/settings')}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Alert settings
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                push('Alert CSV prepared', {
                  description: `${filteredAlerts.length} alerts · mock export`,
                })
              }
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="surface p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted">Open alerts</p>
            <BellRing className="h-3.5 w-3.5 text-health-deforested" />
          </div>
          <p className="mt-2 font-mono text-[22px] leading-none text-health-deforested">
            {openCount}
          </p>
          <p className="mt-2 text-[9px] text-subtle">Require triage</p>
        </div>
        <div className="surface p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted">Critical severity</p>
            <TriangleAlert className="h-3.5 w-3.5 text-health-deforested" />
          </div>
          <p className="mt-2 font-mono text-[22px] leading-none text-health-deforested">
            {criticalCount}
          </p>
          <p className="mt-2 text-[9px] text-subtle">Unresolved critical</p>
        </div>
        <div className="surface p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted">Acknowledged</p>
            <Clock3 className="h-3.5 w-3.5 text-health-stressed" />
          </div>
          <p className="mt-2 font-mono text-[22px] leading-none text-health-stressed">
            {statusCounts.Acknowledged}
          </p>
          <p className="mt-2 text-[9px] text-subtle">Under review</p>
        </div>
        <div className="surface p-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted">Resolved</p>
            <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
          </div>
          <p className="mt-2 font-mono text-[22px] leading-none text-brand">
            {statusCounts.Resolved}
          </p>
          <p className="mt-2 text-[9px] text-subtle">This month</p>
        </div>
      </div>

      <Card className="mt-3 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line px-4 pt-1 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-5">
            {tabStatuses.map((tab) => {
              const active = statusFilter === tab.value
              return (
                <button
                  type="button"
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={cn(
                    'relative flex items-center gap-1.5 py-3 text-[11px] transition',
                    active ? 'text-ink' : 'text-subtle hover:text-muted',
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'font-mono text-[9px]',
                      active ? 'text-brand' : 'text-subtle',
                    )}
                  >
                    {statusCounts[tab.value]}
                  </span>
                  {active ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand" />
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search alerts…"
                className="input h-7 w-[180px] pl-8 text-[11px]"
                aria-label="Search alerts"
              />
            </div>
            <Select
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              options={severityOptions}
              className="w-[132px]"
              selectClassName="h-7 text-[11px]"
              aria-label="Filter severity"
            />
            <Select
              value={province}
              onChange={(event) => setProvince(event.target.value)}
              options={provinceOptions}
              className="w-[132px]"
              selectClassName="h-7 text-[11px]"
              aria-label="Filter province"
            />
            {search ||
            severity !== 'all' ||
            province !== 'all' ||
            statusFilter !== 'all' ? (
              <button
                type="button"
                onClick={clearFilters}
                className="h-7 rounded-md px-2 text-[10px] text-subtle transition hover:bg-elevated hover:text-ink"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={filteredAlerts}
          rowKey="id"
          onRowClick={(row) => setSelectedAlertId(row.id)}
          tableClassName="min-w-[980px]"
          emptyState={
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-elevated">
                <SearchX className="h-4 w-4 text-subtle" />
              </div>
              <p className="mt-3 text-[12px] font-medium text-ink">
                No alerts match your filters
              </p>
              <p className="mt-1 text-[11px] text-subtle">
                Try a different search term or clear the filters.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          }
        />

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
          <span className="font-mono text-[9px] text-subtle">
            Showing {filteredAlerts.length} of {alertRows.length} alerts
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] text-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Synced 12 min ago
          </span>
        </div>
      </Card>

      {selectedAlert ? (
        <AlertDrawer
          key={selectedAlert.id}
          alert={selectedAlert}
          onClose={() => setSelectedAlertId(null)}
          onAcknowledge={() =>
            updateStatus(selectedAlert.id, 'Acknowledged')
          }
          onResolve={() => updateStatus(selectedAlert.id, 'Resolved')}
          onAssign={() => assignToMe(selectedAlert.id)}
          onViewMap={() => {
            setSelectedAlertId(null)
            navigate('/maps', {
              state: {
                provinceId: selectedAlert.provinceId,
                layer: 'ndvi',
              },
            })
          }}
        />
      ) : null}
    </div>
  )
}
