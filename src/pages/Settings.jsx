import { useState } from 'react'
import {
  Check,
  Copy,
  Flame,
  Globe2,
  Orbit,
  Plus,
  Satellite,
  ShieldCheck,
  TriangleAlert,
  Users,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Select from '../components/ui/Select'
import Toggle from '../components/ui/Toggle'
import { useToast } from '../components/ui/toastContext'
import {
  dataSources,
  monitoringSettings as monitoringDefaults,
  notificationSettings as notificationDefaults,
  settingsTabs,
  teamMembers as initialTeamMembers,
  workspaceSettings as workspaceDefaults,
} from '../data/settings'
import {
  sourceStatusDots,
  sourceStatusStyles,
} from '../lib/status'
import { cn } from '../lib/utils'

const sourceIcons = {
  Satellite,
  Orbit,
  Globe2,
  Flame,
}

const timezoneOptions = [
  { value: 'Asia/Manila (UTC+08:00)', label: 'Asia/Manila (UTC+08:00)' },
  { value: 'UTC', label: 'UTC' },
]

const areaUnitOptions = [
  { value: 'Hectares (ha)', label: 'Hectares (ha)' },
  { value: 'Square kilometers (km²)', label: 'Square kilometers (km²)' },
]

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Filipino', label: 'Filipino' },
]

const fiscalYearOptions = [
  { value: 'Calendar year', label: 'Calendar year' },
  { value: 'July – June', label: 'July – June' },
]

const regionOptions = [
  { value: 'Region 1 — Ilocos Region', label: 'Region 1 — Ilocos Region' },
  { value: 'Region 2 — Cagayan Valley', label: 'Region 2 — Cagayan Valley' },
]

const sensitivityOptions = ['Low', 'Medium', 'High']

const roleOptions = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Analyst', label: 'Analyst' },
  { value: 'Viewer', label: 'Viewer' },
]

function Field({ label, hint, children, className }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.08em] text-subtle">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1 block text-[9px] leading-4 text-subtle">
          {hint}
        </span>
      ) : null}
    </label>
  )
}

function InfoRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="shrink-0 text-[10px] text-subtle">{label}</span>
      <span className="min-w-0 text-right text-[10px] text-ink">{children}</span>
    </div>
  )
}

export default function Settings() {
  const { push } = useToast()
  const [activeTab, setActiveTab] = useState('workspace')
  const [workspace, setWorkspace] = useState(workspaceDefaults)
  const [monitoring, setMonitoring] = useState(monitoringDefaults)
  const [notifications, setNotifications] = useState(notificationDefaults)
  const [members, setMembers] = useState(initialTeamMembers)

  const activeTabLabel =
    settingsTabs.find((tab) => tab.value === activeTab)?.label || 'Settings'

  const setWorkspaceField = (key, value) =>
    setWorkspace((current) => ({ ...current, [key]: value }))

  const save = () => {
    push('Settings saved', {
      description: `${activeTabLabel} · Region 1`,
    })
  }

  const copyApiKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('fm_live_sk_mock_region1_7f2a')
    }
    push('API key copied to clipboard')
  }

  const teamColumns = [
    {
      key: 'member',
      header: 'Member',
      render: (row) => (
        <div className="flex min-w-[190px] items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-brand/20 bg-brand/10 font-mono text-[9px] text-brand">
            {row.initials}
          </span>
          <div>
            <p className="text-[11px] font-medium text-ink">{row.name}</p>
            <p className="mt-0.5 text-[9px] text-subtle">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <Select
          value={row.role}
          onChange={(event) => {
            setMembers((current) =>
              current.map((member) =>
                member.id === row.id
                  ? { ...member, role: event.target.value }
                  : member,
              ),
            )
            push('Member role updated', {
              description: `${row.name} · ${event.target.value}`,
            })
          }}
          options={roleOptions}
          className="w-[104px]"
          selectClassName="h-6 text-[10px]"
          aria-label={`Role for ${row.name}`}
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge
          className={
            row.status === 'Active'
              ? 'border-brand/30 bg-brand/10 text-brand'
              : 'border-health-stressed/30 bg-health-stressed/10 text-health-stressed'
          }
          dot
          dotClassName={
            row.status === 'Active' ? 'bg-brand' : 'bg-health-stressed'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'lastActive',
      header: 'Last active',
      className: 'whitespace-nowrap font-mono text-[9px]',
    },
    {
      key: 'remove',
      header: '',
      headerClassName: 'w-10',
      render: (row) => (
        <button
          type="button"
          onClick={() =>
            push('Member removal disabled', {
              description: `${row.name} · prototype only`,
              tone: 'error',
            })
          }
          className="text-[9px] text-subtle transition hover:text-health-deforested"
        >
          Remove
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Settings"
        meta={
          <Badge
            className="border-line bg-elevated text-muted"
            dot
            dotClassName="bg-brand"
          >
            Region 1
          </Badge>
        }
        description="Configure the workspace, monitoring thresholds, data sources and access."
        actions={
          <Button variant="primary" onClick={save}>
            <Check className="h-3.5 w-3.5" />
            Save changes
          </Button>
        }
      />

      <div className="mb-4 border-b border-line">
        <div className="flex items-center gap-5 overflow-x-auto">
          {settingsTabs.map((tab) => {
            const active = activeTab === tab.value
            return (
              <button
                type="button"
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'relative shrink-0 py-3 text-[11px] transition',
                  active ? 'text-ink' : 'text-subtle hover:text-muted',
                )}
              >
                {tab.label}
                {active ? (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand" />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="space-y-3 xl:col-span-8">
          {activeTab === 'workspace' ? (
            <>
              <Card>
                <CardHeader
                  title="Workspace details"
                  description="Project identity and regional defaults."
                />
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                  <Field label="Project name">
                    <input
                      value={workspace.projectName}
                      onChange={(event) =>
                        setWorkspaceField('projectName', event.target.value)
                      }
                      className="input"
                    />
                  </Field>
                  <Field label="Project ID">
                    <input
                      value={workspace.projectId}
                      readOnly
                      className="input font-mono text-[10px] text-subtle"
                    />
                  </Field>
                  <Field label="Region">
                    <Select
                      value={workspace.region}
                      onChange={(event) =>
                        setWorkspaceField('region', event.target.value)
                      }
                      options={regionOptions}
                    />
                  </Field>
                  <Field label="Timezone">
                    <Select
                      value={workspace.timezone}
                      onChange={(event) =>
                        setWorkspaceField('timezone', event.target.value)
                      }
                      options={timezoneOptions}
                    />
                  </Field>
                  <Field label="Area unit">
                    <Select
                      value={workspace.areaUnit}
                      onChange={(event) =>
                        setWorkspaceField('areaUnit', event.target.value)
                      }
                      options={areaUnitOptions}
                    />
                  </Field>
                  <Field label="Language">
                    <Select
                      value={workspace.language}
                      onChange={(event) =>
                        setWorkspaceField('language', event.target.value)
                      }
                      options={languageOptions}
                    />
                  </Field>
                  <Field label="Fiscal year">
                    <Select
                      value={workspace.fiscalYear}
                      onChange={(event) =>
                        setWorkspaceField('fiscalYear', event.target.value)
                      }
                      options={fiscalYearOptions}
                    />
                  </Field>
                  <Field label="Default map center">
                    <input
                      value={workspace.defaultMapCenter}
                      onChange={(event) =>
                        setWorkspaceField(
                          'defaultMapCenter',
                          event.target.value,
                        )
                      }
                      className="input font-mono text-[10px]"
                    />
                  </Field>
                  <Field
                    label="Default zoom"
                    hint="Applied when opening Canopy Maps."
                  >
                    <input
                      value={workspace.defaultZoom}
                      onChange={(event) =>
                        setWorkspaceField('defaultZoom', event.target.value)
                      }
                      className="input font-mono text-[10px]"
                    />
                  </Field>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-3">
                  <p className="text-[9px] text-subtle">
                    Changes apply to all Region 1 dashboards and exports.
                  </p>
                  <Button variant="secondary" size="sm" onClick={save}>
                    Save details
                  </Button>
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Model defaults"
                  description="Current production inference configuration."
                />
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                  <Field label="Canopy model">
                    <Select
                      value={monitoring.modelVersion}
                      onChange={(event) =>
                        setMonitoring((current) => ({
                          ...current,
                          modelVersion: event.target.value,
                        }))
                      }
                      options={[
                        { value: 'ResNet-50 v2.4.1', label: 'ResNet-50 v2.4.1' },
                        { value: 'ResNet-50 v2.3.0', label: 'ResNet-50 v2.3.0' },
                      ]}
                    />
                  </Field>
                  <Field label="Segmentation model">
                    <Select
                      value={monitoring.segmentationModel}
                      onChange={(event) =>
                        setMonitoring((current) => ({
                          ...current,
                          segmentationModel: event.target.value,
                        }))
                      }
                      options={[
                        { value: 'U-Net CNN v1.8.0', label: 'U-Net CNN v1.8.0' },
                        { value: 'U-Net CNN v1.7.2', label: 'U-Net CNN v1.7.2' },
                      ]}
                    />
                  </Field>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-3">
                  <p className="text-[9px] text-subtle">
                    Model changes apply to the next processed acquisition.
                  </p>
                  <Button variant="secondary" size="sm" onClick={save}>
                    Save model
                  </Button>
                </div>
              </Card>
            </>
          ) : null}

          {activeTab === 'monitoring' ? (
            <>
              <Card>
                <CardHeader
                  title="Detection thresholds"
                  description="Control when canopy changes generate an alert."
                />
                <div className="space-y-6 p-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-medium text-ink">
                          Canopy loss threshold
                        </p>
                        <p className="mt-0.5 text-[9px] text-subtle">
                          Minimum canopy change required to trigger an alert.
                        </p>
                      </div>
                      <span className="rounded border border-line bg-canvas px-2 py-0.5 font-mono text-[10px] text-brand">
                        {monitoring.canopyLossThreshold}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      value={monitoring.canopyLossThreshold}
                      onChange={(event) =>
                        setMonitoring((current) => ({
                          ...current,
                          canopyLossThreshold: Number(event.target.value),
                        }))
                      }
                      className="range mt-4"
                    />
                    <div className="mt-1 flex justify-between font-mono text-[8px] text-subtle">
                      <span>5%</span>
                      <span>40%</span>
                    </div>
                  </div>

                  <div className="border-t border-line pt-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-medium text-ink">
                          Model confidence threshold
                        </p>
                        <p className="mt-0.5 text-[9px] text-subtle">
                          Discard detections below this confidence score.
                        </p>
                      </div>
                      <span className="rounded border border-line bg-canvas px-2 py-0.5 font-mono text-[10px] text-brand">
                        {monitoring.confidenceThreshold}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="99"
                      step="1"
                      value={monitoring.confidenceThreshold}
                      onChange={(event) =>
                        setMonitoring((current) => ({
                          ...current,
                          confidenceThreshold: Number(event.target.value),
                        }))
                      }
                      className="range mt-4"
                    />
                    <div className="mt-1 flex justify-between font-mono text-[8px] text-subtle">
                      <span>60%</span>
                      <span>99%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Alert behavior"
                  description="Tune sensitivity and automatic delivery."
                />
                <div className="p-4">
                  <div className="flex flex-col gap-3 rounded-md border border-line bg-canvas/40 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[11px] text-ink">Alert sensitivity</p>
                      <p className="mt-0.5 text-[9px] text-subtle">
                        Higher sensitivity surfaces smaller changes.
                      </p>
                    </div>
                    <div className="flex w-fit items-center gap-0.5 rounded-md border border-line bg-canvas p-0.5">
                      {sensitivityOptions.map((option) => (
                        <button
                          type="button"
                          key={option}
                          onClick={() =>
                            setMonitoring((current) => ({
                              ...current,
                              alertSensitivity: option,
                            }))
                          }
                          className={cn(
                            'h-6 rounded px-2.5 text-[10px] transition',
                            monitoring.alertSensitivity === option
                              ? 'bg-elevated text-ink'
                              : 'text-subtle hover:text-muted',
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between gap-4 rounded-md border border-line px-3 py-2.5">
                      <div>
                        <p className="text-[11px] text-ink">
                          Automatic alerts
                        </p>
                        <p className="mt-0.5 text-[9px] text-subtle">
                          Create alerts after each processed scene
                        </p>
                      </div>
                      <Toggle
                        checked={monitoring.autoAlerts}
                        onChange={(value) =>
                          setMonitoring((current) => ({
                            ...current,
                            autoAlerts: value,
                          }))
                        }
                        label="Automatic alerts"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 rounded-md border border-line px-3 py-2.5">
                      <div>
                        <p className="text-[11px] text-ink">
                          Include low severity
                        </p>
                        <p className="mt-0.5 text-[9px] text-subtle">
                          Show low-confidence anomalies in alert lists
                        </p>
                      </div>
                      <Toggle
                        checked={monitoring.includeLowSeverity}
                        onChange={(value) =>
                          setMonitoring((current) => ({
                            ...current,
                            includeLowSeverity: value,
                          }))
                        }
                        label="Include low severity"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-3">
                  <p className="text-[9px] text-subtle">
                    Thresholds are applied on the next acquisition.
                  </p>
                  <Button variant="secondary" size="sm" onClick={save}>
                    Save thresholds
                  </Button>
                </div>
              </Card>
            </>
          ) : null}

          {activeTab === 'sources' ? (
            <>
              <div className="mb-1 flex items-end justify-between">
                <div>
                  <h2 className="text-[13px] font-medium text-ink">
                    Imagery sources
                  </h2>
                  <p className="mt-0.5 text-[10px] text-subtle">
                    Connected feeds used for canopy and health processing.
                  </p>
                </div>
                <span className="font-mono text-[9px] text-subtle">
                  3 connected
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {dataSources.map((source) => {
                  const Icon = sourceIcons[source.icon] || Satellite
                  return (
                    <Card key={source.id} className="flex flex-col p-4">
                      <div className="flex items-start justify-between">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-elevated text-muted">
                          <Icon className="h-4 w-4" />
                        </span>
                        <Badge
                          className={
                            sourceStatusStyles[source.status] ||
                            'border-line bg-elevated text-muted'
                          }
                          dot
                          dotClassName={
                            sourceStatusDots[source.status] || 'bg-subtle'
                          }
                        >
                          {source.status}
                        </Badge>
                      </div>
                      <p className="mt-3 text-[12px] font-medium text-ink">
                        {source.name}
                      </p>
                      <p className="mt-0.5 text-[9px] text-subtle">
                        {source.provider}
                      </p>
                      <p className="mt-2 flex-1 text-[10px] leading-4 text-muted">
                        {source.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                        <span className="font-mono text-[9px] text-subtle">
                          {source.scenes} · {source.lastSync}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            push(`${source.name} configuration opened`, {
                              description: 'Mock source settings',
                            })
                          }
                          className="text-[10px] text-brand transition hover:text-brand-hover"
                        >
                          Configure
                        </button>
                      </div>
                    </Card>
                  )
                })}

                <button
                  type="button"
                  onClick={() =>
                    push('Add data source', {
                      description: 'Source catalog is disabled in this prototype.',
                      tone: 'error',
                    })
                  }
                  className="flex min-h-[190px] flex-col items-center justify-center rounded-lg border border-dashed border-line bg-transparent p-4 text-subtle transition hover:border-[#3a3a3a] hover:bg-panel hover:text-ink"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-elevated">
                    <Plus className="h-4 w-4" />
                  </span>
                  <span className="mt-2 text-[11px]">Add data source</span>
                  <span className="mt-0.5 text-[9px] text-subtle">
                    Planet, MODIS, custom STAC
                  </span>
                </button>
              </div>

              <Card>
                <CardHeader
                  title="Sync schedule"
                  description="Acquisition polling and processing cadence."
                />
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                  <Field label="Polling interval">
                    <Select
                      value="Every 15 minutes"
                      onChange={() => {}}
                      options={[
                        { value: 'Every 15 minutes', label: 'Every 15 minutes' },
                        { value: 'Every 30 minutes', label: 'Every 30 minutes' },
                        { value: 'Hourly', label: 'Hourly' },
                      ]}
                    />
                  </Field>
                  <Field label="Processing window">
                    <Select
                      value="Immediate"
                      onChange={() => {}}
                      options={[
                        { value: 'Immediate', label: 'Immediate' },
                        { value: 'Nightly', label: 'Nightly · 01:00 PHT' },
                      ]}
                    />
                  </Field>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-3">
                  <span className="flex items-center gap-1.5 font-mono text-[9px] text-subtle">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    Last sync 12 min ago
                  </span>
                  <Button variant="secondary" size="sm" onClick={save}>
                    Save schedule
                  </Button>
                </div>
              </Card>
            </>
          ) : null}

          {activeTab === 'notifications' ? (
            <>
              <Card>
                <CardHeader
                  title="Alert notifications"
                  description="Choose which events reach the team."
                />
                <div className="divide-y divide-line">
                  {[
                    {
                      key: 'criticalAlerts',
                      title: 'Critical alerts',
                      description: 'Immediate notification for critical anomalies',
                    },
                    {
                      key: 'canopyThreshold',
                      title: 'Canopy threshold alerts',
                      description: 'Notify when canopy loss exceeds 15%',
                    },
                    {
                      key: 'reportReady',
                      title: 'Report ready',
                      description: 'Send a link when a generated report completes',
                    },
                    {
                      key: 'productUpdates',
                      title: 'Product updates',
                      description: 'Monthly notes on new models and features',
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div>
                        <p className="text-[11px] text-ink">{item.title}</p>
                        <p className="mt-0.5 text-[9px] text-subtle">
                          {item.description}
                        </p>
                      </div>
                      <Toggle
                        checked={notifications[item.key]}
                        onChange={(value) =>
                          setNotifications((current) => ({
                            ...current,
                            [item.key]: value,
                          }))
                        }
                        label={item.title}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Delivery channels"
                  description="Where alerts and digests are sent."
                />
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                  <Field label="Email address">
                    <input
                      value={notifications.email}
                      onChange={(event) =>
                        setNotifications((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      className="input"
                    />
                  </Field>
                  <Field label="Slack channel">
                    <input
                      value={notifications.slackChannel}
                      onChange={(event) =>
                        setNotifications((current) => ({
                          ...current,
                          slackChannel: event.target.value,
                        }))
                      }
                      className="input font-mono text-[10px]"
                    />
                  </Field>
                  <Field label="Weekly digest">
                    <Select
                      value={notifications.digestDay}
                      onChange={(event) =>
                        setNotifications((current) => ({
                          ...current,
                          digestDay: event.target.value,
                        }))
                      }
                      options={[
                        { value: 'Monday · 08:00 PHT', label: 'Monday · 08:00 PHT' },
                        { value: 'Friday · 16:00 PHT', label: 'Friday · 16:00 PHT' },
                      ]}
                    />
                  </Field>
                  <div className="flex items-end">
                    <div className="flex w-full items-center justify-between rounded-md border border-line px-3 py-2">
                      <div>
                        <p className="text-[11px] text-ink">Weekly digest</p>
                        <p className="mt-0.5 text-[9px] text-subtle">
                          Regional summary every week
                        </p>
                      </div>
                      <Toggle
                        checked={notifications.weeklyDigest}
                        onChange={(value) =>
                          setNotifications((current) => ({
                            ...current,
                            weeklyDigest: value,
                          }))
                        }
                        label="Weekly digest"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-line px-4 py-3">
                  <p className="text-[9px] text-subtle">
                    Notification delivery is simulated in this prototype.
                  </p>
                  <Button variant="secondary" size="sm" onClick={save}>
                    Save notifications
                  </Button>
                </div>
              </Card>
            </>
          ) : null}

          {activeTab === 'team' ? (
            <>
              <Card className="overflow-hidden">
                <CardHeader
                  title="Team members"
                  description="Manage access to the Region 1 workspace."
                  action={
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        push('Invite link copied', {
                          description: 'Mock invitation link for Region 1',
                        })
                      }
                    >
                      <Plus className="h-3 w-3" />
                      Invite
                    </Button>
                  }
                />
                <DataTable
                  columns={teamColumns}
                  rows={members}
                  rowKey="id"
                  tableClassName="min-w-[700px]"
                />
                <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
                  <span className="font-mono text-[9px] text-subtle">
                    {members.length} members · 1 pending invite
                  </span>
                  <span className="flex items-center gap-1.5 text-[9px] text-subtle">
                    <Users className="h-3 w-3" />
                    Workspace seats
                  </span>
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Roles and permissions"
                  description="Role-based access across the monitoring workspace."
                />
                <div className="divide-y divide-line">
                  {[
                    {
                      role: 'Owner',
                      detail: 'Full workspace access, billing and member management',
                    },
                    {
                      role: 'Admin',
                      detail: 'Manage sources, alerts, reports and workspace settings',
                    },
                    {
                      role: 'Analyst',
                      detail: 'Review alerts, generate reports and export imagery',
                    },
                    {
                      role: 'Viewer',
                      detail: 'Read-only access to dashboards, maps and reports',
                    },
                  ].map((item) => (
                    <div
                      key={item.role}
                      className="flex items-start gap-3 px-4 py-3"
                    >
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                      <div>
                        <p className="text-[11px] font-medium text-ink">
                          {item.role}
                        </p>
                        <p className="mt-0.5 text-[9px] text-subtle">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : null}
        </div>

        <aside className="space-y-3 xl:col-span-4">
          <Card>
            <CardHeader
              title="Project"
              description="Region 1 workspace overview"
              action={
                <Badge className="border-line bg-elevated text-muted">
                  Prototype
                </Badge>
              }
            />
            <div className="space-y-2.5 p-4">
              <InfoRow label="Project ID">
                <span className="font-mono text-[9px] text-muted">
                  fcm-region-1-ilocos
                </span>
              </InfoRow>
              <InfoRow label="Region">
                <span>Ilocos Region, PH</span>
              </InfoRow>
              <InfoRow label="Monitored area">
                <span className="font-mono text-brand">22,100 ha</span>
              </InfoRow>
              <InfoRow label="Data sources">
                <span className="font-mono">3 connected</span>
              </InfoRow>
              <InfoRow label="Last sync">
                <span className="font-mono">12 min ago</span>
              </InfoRow>
              <InfoRow label="Created">
                <span className="font-mono">Aug 12, 2026</span>
              </InfoRow>

              <div className="mt-3 rounded-md border border-line bg-canvas p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] uppercase tracking-[0.1em] text-subtle">
                    API key
                  </span>
                  <button
                    type="button"
                    onClick={copyApiKey}
                    className="inline-flex items-center gap-1 text-[9px] text-subtle transition hover:text-ink"
                  >
                    <Copy className="h-2.5 w-2.5" />
                    Copy
                  </button>
                </div>
                <p className="mt-1 truncate font-mono text-[9px] text-muted">
                  fm_live_sk_••••••••••7f2a
                </p>
              </div>
            </div>
            <div className="border-t border-line p-3">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => setActiveTab('sources')}
              >
                Manage data sources
              </Button>
            </div>
          </Card>

          <div className="rounded-lg border border-health-stressed/20 bg-health-stressed/5 p-3.5">
            <div className="flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-health-stressed" />
              <div>
                <p className="text-[10px] font-medium text-health-stressed">
                  Prototype environment
                </p>
                <p className="mt-1 text-[9px] leading-4 text-subtle">
                  Settings are stored in local component state. No backend,
                  imagery processing or notifications are connected.
                </p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader
              title="Environment"
              description="Regional processing configuration"
            />
            <div className="space-y-2.5 p-4">
              <InfoRow label="Model">
                <span className="font-mono text-[9px]">ResNet-50 v2.4.1</span>
              </InfoRow>
              <InfoRow label="Imagery">
                <span className="font-mono text-[9px]">Sentinel-2 · 10 m</span>
              </InfoRow>
              <InfoRow label="Storage">
                <span className="font-mono text-[9px]">342 GB / 1.5 TB</span>
              </InfoRow>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-elevated">
                <div className="h-full w-[23%] rounded-full bg-brand" />
              </div>
              <InfoRow label="Status">
                <span className="inline-flex items-center gap-1.5 text-brand">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  Operational
                </span>
              </InfoRow>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
