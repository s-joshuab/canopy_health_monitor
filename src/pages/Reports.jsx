import { useMemo, useState } from 'react'
import {
  ArrowRight,
  CalendarClock,
  Columns3,
  Download,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  Plus,
  ShieldAlert,
  Sparkles,
  TreePine,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'
import Select from '../components/ui/Select'
import Skeleton from '../components/ui/Skeleton'
import Toggle from '../components/ui/Toggle'
import { useToast } from '../components/ui/toastContext'
import {
  reportHistory,
  reportScopeOptions,
  reportStats,
  reportStatusOptions,
  reportTemplates,
  reportTypeOptions,
} from '../data/reports'
import { reportStatusStyles } from '../lib/status'
import { cn } from '../lib/utils'

const templateIcons = {
  FileBarChart,
  ShieldAlert,
  TreePine,
  Columns3,
}

const accentStyles = {
  brand: 'border-brand/30 bg-brand/10 text-brand',
  orange:
    'border-health-degraded/30 bg-health-degraded/10 text-health-degraded',
  red:
    'border-health-deforested/30 bg-health-deforested/10 text-health-deforested',
  lime:
    'border-health-moderate/30 bg-health-moderate/10 text-health-moderate',
}

const periodOptions = [
  { value: 'Nov 1 – Nov 20, 2026', label: 'Nov 1 – Nov 20, 2026' },
  { value: 'Oct 1 – Oct 31, 2026', label: 'Oct 1 – Oct 31, 2026' },
  { value: 'Last 90 days', label: 'Last 90 days' },
  { value: 'Custom range', label: 'Custom range' },
]

const formatOptions = ['PDF', 'CSV', 'XLSX']

const defaultForm = {
  name: 'Regional Canopy Summary · November',
  type: 'Regional Canopy Summary',
  scope: 'Region 1 · All provinces',
  period: 'Nov 1 – Nov 20, 2026',
  format: 'PDF',
  includeMaps: true,
  emailWhenReady: true,
}

export default function Reports() {
  const { push } = useToast()
  const [reports, setReports] = useState(reportHistory)
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(defaultForm)

  const statusCounts = useMemo(
    () => ({
      all: reports.length,
      Ready: reports.filter((report) => report.status === 'Ready').length,
      Generating: reports.filter((report) => report.status === 'Generating')
        .length,
      Failed: reports.filter((report) => report.status === 'Failed').length,
    }),
    [reports],
  )

  const filteredReports = useMemo(
    () =>
      statusFilter === 'all'
        ? reports
        : reports.filter((report) => report.status === statusFilter),
    [reports, statusFilter],
  )

  const openTemplate = (template) => {
    setForm({
      ...defaultForm,
      name: `${template.title} · Nov 2026`,
      type: template.title,
      scope:
        template.scope === 'Region 1' || template.scope === 'All provinces'
          ? 'Region 1 · All provinces'
          : template.scope === '4 provinces'
            ? 'Region 1 · All provinces'
            : template.scope,
      format: template.format,
    })
    setModalOpen(true)
  }

  const generateReport = () => {
    const nextNumber = 42 + reports.filter((report) => report.id.startsWith('RPT-2026')).length - 6
    const id = `RPT-2026-${String(Math.max(nextNumber, 42)).padStart(3, '0')}`
    const newReport = {
      id,
      name: form.name.trim() || form.type,
      type: form.type,
      scope: form.scope,
      period: form.period,
      generated: 'Just now',
      by: 'Joshua Sacquiaten',
      format: form.format,
      size: '—',
      status: 'Generating',
    }
    setReports((current) => [newReport, ...current])
    setStatusFilter('all')
    setModalOpen(false)
    push('Report generation started', {
      description: `${form.name || form.type} · ${form.format}`,
    })
    window.setTimeout(() => {
      setReports((current) =>
        current.map((report) =>
          report.id === id
            ? { ...report, status: 'Ready', size: '3.6 MB' }
            : report,
        ),
      )
      push('Report ready to download', {
        description: `${form.name || form.type} · 3.6 MB`,
      })
    }, 2600)
  }

  const columns = [
    {
      key: 'name',
      header: 'Report',
      render: (row) => (
        <div className="min-w-[220px]">
          <p className="text-[12px] font-medium text-ink">{row.name}</p>
          <p className="mt-0.5 font-mono text-[9px] text-subtle">
            {row.id} · {row.type}
          </p>
        </div>
      ),
    },
    {
      key: 'scope',
      header: 'Scope',
      render: (row) => (
        <div className="min-w-[150px]">
          <p className="text-[11px] text-ink">{row.scope}</p>
          <p className="mt-0.5 font-mono text-[9px] text-subtle">
            {row.period}
          </p>
        </div>
      ),
    },
    {
      key: 'generated',
      header: 'Generated',
      render: (row) => (
        <div className="whitespace-nowrap">
          <p className="font-mono text-[10px] text-ink">{row.generated}</p>
          <p className="mt-0.5 text-[9px] text-subtle">{row.by}</p>
        </div>
      ),
    },
    {
      key: 'format',
      header: 'Format',
      render: (row) => (
        <div>
          <span className="font-mono text-[10px] text-ink">{row.format}</span>
          <p className="mt-0.5 font-mono text-[9px] text-subtle">{row.size}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) =>
        row.status === 'Generating' ? (
          <div className="flex min-w-[110px] items-center gap-2">
            <Badge className={reportStatusStyles.Generating}>
              Generating
            </Badge>
            <Skeleton className="h-1 w-10" />
          </div>
        ) : (
          <Badge className={reportStatusStyles[row.status]}>{row.status}</Badge>
        ),
    },
    {
      key: 'download',
      header: '',
      headerClassName: 'w-10',
      render: (row) => (
        <button
          type="button"
          disabled={row.status !== 'Ready'}
          onClick={() =>
            push('Report download prepared', {
              description: `${row.id} · ${row.format} · ${row.size}`,
            })
          }
          className="icon-button h-6 w-6 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Download ${row.name}`}
        >
          <Download className="h-3 w-3" />
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Reports"
        meta={
          <Badge
            className="border-line bg-elevated text-muted"
            dot
            dotClassName="bg-brand"
          >
            3 scheduled
          </Badge>
        }
        description="Generate, schedule and export canopy health reports for decision makers."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                push('Report schedule opened', {
                  description: 'Next scheduled run: Nov 30, 2026 · 08:00 PHT',
                })
              }
            >
              <CalendarClock className="h-3.5 w-3.5" />
              Schedule
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setForm(defaultForm)
                setModalOpen(true)
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              New report
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {reportStats.map((stat) => (
          <div key={stat.label} className="surface p-4">
            <p className="text-[10px] text-muted">{stat.label}</p>
            <p className="mt-2 font-mono text-[22px] leading-none text-ink">
              {stat.value}
            </p>
            <p className="mt-2 text-[9px] text-subtle">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-2.5 mt-5 flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-medium text-ink">Report templates</h2>
          <p className="mt-0.5 text-[10px] text-subtle">
            Start from a pre-configured Region 1 analysis.
          </p>
        </div>
        <span className="font-mono text-[9px] text-subtle">
          {reportTemplates.length} available
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {reportTemplates.map((template) => {
          const Icon = templateIcons[template.icon] || FileText
          return (
            <div
              key={template.id}
              className="surface flex flex-col p-4 transition hover:border-[#3a3a3a]"
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-md border',
                    accentStyles[template.accent] || accentStyles.brand,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[9px] text-subtle">
                  {template.format}
                </span>
              </div>
              <p className="mt-3 text-[12px] font-medium leading-5 text-ink">
                {template.title}
              </p>
              <p className="mt-1 flex-1 text-[10px] leading-4 text-subtle">
                {template.description}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <span className="font-mono text-[9px] text-subtle">
                  {template.scope}
                </span>
                <button
                  type="button"
                  onClick={() => openTemplate(template)}
                  className="inline-flex items-center gap-1 text-[10px] text-brand transition hover:text-brand-hover"
                >
                  Use template
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <Card className="mt-5 overflow-hidden">
        <CardHeader
          title="Recent reports"
          description="Generated and scheduled exports"
          action={
            <span className="flex items-center gap-1.5 font-mono text-[9px] text-subtle">
              <FileSpreadsheet className="h-3 w-3" />
              {statusCounts.Ready} ready
            </span>
          }
        />
        <div className="flex flex-col gap-2 border-b border-line px-4 pt-1 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-5">
            {reportStatusOptions.map((tab) => {
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
          <span className="pb-2.5 font-mono text-[9px] text-subtle">
            {filteredReports.length} reports
          </span>
        </div>
        <DataTable
          columns={columns}
          rows={filteredReports}
          rowKey="id"
          tableClassName="min-w-[920px]"
          emptyState={
            <div className="text-center">
              <p className="text-[12px] font-medium text-ink">
                No reports in this view
              </p>
              <p className="mt-1 text-[11px] text-subtle">
                Generate a new report or change the status filter.
              </p>
            </div>
          }
        />
        <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
          <span className="font-mono text-[9px] text-subtle">
            Exports retain the current canopy model version
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] text-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Storage · 342 GB
          </span>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generate report"
        description="Configure a Region 1 export. The prototype simulates generation."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={generateReport}>
              <Sparkles className="h-3.5 w-3.5" />
              Generate report
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="report-name"
              className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.08em] text-subtle"
            >
              Report name
            </label>
            <input
              id="report-name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="input"
              placeholder="Report name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="report-type"
                className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.08em] text-subtle"
              >
                Report type
              </label>
              <Select
                id="report-type"
                value={form.type}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    type: event.target.value,
                  }))
                }
                options={reportTypeOptions}
              />
            </div>
            <div>
              <label
                htmlFor="report-scope"
                className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.08em] text-subtle"
              >
                Scope
              </label>
              <Select
                id="report-scope"
                value={form.scope}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    scope: event.target.value,
                  }))
                }
                options={reportScopeOptions}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="report-period"
              className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.08em] text-subtle"
            >
              Reporting period
            </label>
            <Select
              id="report-period"
              value={form.period}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  period: event.target.value,
                }))
              }
              options={periodOptions}
            />
          </div>

          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-subtle">
              Format
            </p>
            <div className="flex w-fit items-center gap-0.5 rounded-md border border-line bg-canvas p-0.5">
              {formatOptions.map((format) => (
                <button
                  type="button"
                  key={format}
                  onClick={() =>
                    setForm((current) => ({ ...current, format }))
                  }
                  className={cn(
                    'h-6 rounded px-2.5 font-mono text-[10px] transition',
                    form.format === format
                      ? 'bg-elevated text-ink'
                      : 'text-subtle hover:text-muted',
                  )}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-md border border-line bg-canvas/40 p-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-ink">Include canopy maps</p>
                <p className="mt-0.5 text-[9px] text-subtle">
                  Append province and alert maps
                </p>
              </div>
              <Toggle
                checked={form.includeMaps}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    includeMaps: value,
                  }))
                }
                label="Include canopy maps"
              />
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
              <div>
                <p className="text-[11px] text-ink">Email when ready</p>
                <p className="mt-0.5 text-[9px] text-subtle">
                  Send to forest.monitor@denr.gov.ph
                </p>
              </div>
              <Toggle
                checked={form.emailWhenReady}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    emailWhenReady: value,
                  }))
                }
                label="Email when ready"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
