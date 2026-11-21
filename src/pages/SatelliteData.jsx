import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  CloudSun,
  Cpu,
  Database,
  Download,
  Map,
  Plus,
  RefreshCw,
  Satellite,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Select from '../components/ui/Select'
import Skeleton from '../components/ui/Skeleton'
import ScenePreview from '../components/ui/ScenePreview'
import { useToast } from '../components/ui/toastContext'
import {
  constellation,
  latestScene,
  pipelineJobs,
  satelliteOptions,
  satelliteStats,
  sceneStatusOptions,
  scenes,
} from '../data/satellite'
import { cn } from '../lib/utils'

const statIcons = {
  Satellite,
  Database,
  CloudSun,
  Cpu,
}

const sceneStatusStyles = {
  Processed: 'border-brand/30 bg-brand/10 text-brand',
  Processing: 'border-health-stressed/30 bg-health-stressed/10 text-health-stressed',
  Queued: 'border-line bg-elevated text-muted',
}

const jobStatusStyles = {
  Running: 'border-brand/30 bg-brand/10 text-brand',
  Complete: 'border-brand/30 bg-brand/10 text-brand',
  Queued: 'border-line bg-elevated text-muted',
}

const constellationStatusStyles = {
  Operational: 'border-brand/30 bg-brand/10 text-brand',
  Tasking: 'border-health-stressed/30 bg-health-stressed/10 text-health-stressed',
}

export default function SatelliteData() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [syncing, setSyncing] = useState(false)
  const [search, setSearch] = useState('')
  const [satellite, setSatellite] = useState('all')
  const [status, setStatus] = useState('all')

  const filteredScenes = useMemo(() => {
    const term = search.trim().toLowerCase()
    return scenes.filter((scene) => {
      const matchesSearch =
        !term ||
        `${scene.id} ${scene.satellite} ${scene.province}`
          .toLowerCase()
          .includes(term)
      const matchesSatellite =
        satellite === 'all' || scene.satellite === satellite
      const matchesStatus = status === 'all' || scene.status === status
      return matchesSearch && matchesSatellite && matchesStatus
    })
  }, [satellite, search, status])

  const refresh = () => {
    setSyncing(true)
    window.setTimeout(() => {
      setSyncing(false)
      push('Imagery catalog refreshed', {
        description: 'Latest scene: Sentinel-2B · Nov 18, 2026',
      })
    }, 850)
  }

  const columns = [
    {
      key: 'scene',
      header: 'Scene',
      render: (row) => (
        <div className="max-w-[270px]">
          <p
            className="truncate font-mono text-[10px] text-ink"
            title={row.id}
          >
            {row.id}
          </p>
          <p className="mt-0.5 text-[9px] text-subtle">
            {row.province} · {row.resolution}
          </p>
        </div>
      ),
    },
    {
      key: 'satellite',
      header: 'Satellite',
      className: 'whitespace-nowrap text-[11px] text-ink',
    },
    {
      key: 'captured',
      header: 'Captured',
      className: 'whitespace-nowrap font-mono text-[10px]',
    },
    {
      key: 'cloudCover',
      header: 'Cloud',
      className: 'font-mono text-[10px]',
      render: (row) => (
        <span
          className={cn(
            row.cloudCover > 20 ? 'text-health-degraded' : 'text-muted',
          )}
        >
          {row.cloudCover}%
        </span>
      ),
    },
    {
      key: 'coverage',
      header: 'Coverage',
      className: 'font-mono text-[10px]',
      render: (row) => `${row.coverage}%`,
    },
    {
      key: 'ndvi',
      header: 'Mean NDVI',
      render: (row) => (
        <span
          className={cn(
            'font-mono text-[10px]',
            row.ndvi >= 0.65
              ? 'text-brand'
              : row.ndvi >= 0.55
                ? 'text-health-moderate'
                : 'text-health-degraded',
          )}
        >
          {row.ndvi.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge className={sceneStatusStyles[row.status]}>{row.status}</Badge>
      ),
    },
    {
      key: 'download',
      header: '',
      headerClassName: 'w-10',
      render: (row) => (
        <button
          type="button"
          onClick={() =>
            push('Scene download prepared', {
              description: `${row.id.slice(0, 22)}… · ${row.size}`,
            })
          }
          className="icon-button h-6 w-6"
          aria-label={`Download ${row.id}`}
        >
          <Download className="h-3 w-3" />
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Satellite Data"
        meta={
          <Badge
            className="border-brand/30 bg-brand/10 text-brand"
            dot
            dotClassName="bg-brand"
          >
            3 feeds active
          </Badge>
        }
        description="Acquisitions, processing status and model-ready scenes for Region 1."
        actions={
          <>
            <button
              type="button"
              onClick={refresh}
              className="icon-button border border-line bg-panel"
              aria-label="Refresh catalog"
              title="Refresh catalog"
            >
              <RefreshCw
                className={cn('h-3.5 w-3.5', syncing && 'animate-spin')}
              />
            </button>
            <Button variant="secondary" onClick={() => navigate('/settings')}>
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Configure sources
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                push('Capture request submitted', {
                  description: 'Tasking request queued for the next pass.',
                })
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Request capture
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {satelliteStats.map((stat) => {
          const Icon = statIcons[stat.icon] || Satellite
          return (
            <div key={stat.id} className="surface p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted">{stat.label}</span>
                <Icon className="h-3.5 w-3.5 text-subtle" />
              </div>
              <p
                className={cn(
                  'mt-2.5 font-mono text-[21px] leading-none',
                  stat.tone === 'brand' ? 'text-brand' : 'text-ink',
                )}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-[9px] text-subtle">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Card className="flex flex-col overflow-hidden xl:col-span-8">
          <CardHeader
            title="Latest acquisition"
            description={`${latestScene.satellite} · ${latestScene.instrument}`}
            action={
              <Badge className={sceneStatusStyles[latestScene.status]}>
                {latestScene.status}
              </Badge>
            }
          />
          <div className="grid flex-1 md:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]">
            <div className="relative min-h-[280px] border-b border-line md:border-b-0 md:border-r">
              {syncing ? (
                <Skeleton className="h-full min-h-[280px] w-full rounded-none" />
              ) : (
                <ScenePreview className="h-full min-h-[280px]" />
              )}
            </div>

            <div className="flex flex-col p-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                  Scene ID
                </p>
                <p
                  className="mt-1 truncate font-mono text-[10px] text-ink"
                  title={latestScene.id}
                >
                  {latestScene.id}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 rounded-md border border-line bg-canvas/50 p-3">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.1em] text-subtle">
                    Cloud cover
                  </p>
                  <p className="mt-1 font-mono text-[15px] text-ink">
                    {latestScene.cloudCover}%
                  </p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.1em] text-subtle">
                    Coverage
                  </p>
                  <p className="mt-1 font-mono text-[15px] text-ink">
                    {latestScene.coverage}%
                  </p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.1em] text-subtle">
                    Mean NDVI
                  </p>
                  <p className="mt-1 font-mono text-[15px] text-brand">
                    {latestScene.ndviMean.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.1em] text-subtle">
                    Inference
                  </p>
                  <p className="mt-1 font-mono text-[15px] text-ink">
                    {latestScene.inference}
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-subtle">Captured</span>
                  <span className="font-mono text-ink">
                    {latestScene.captured}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-subtle">Ingested</span>
                  <span className="font-mono text-ink">
                    {latestScene.ingested}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-subtle">Model</span>
                  <span className="text-ink">{latestScene.model}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-subtle">Tiles</span>
                  <span className="font-mono text-ink">
                    {latestScene.tiles} · {latestScene.resolution}
                  </span>
                </div>
              </div>

              <div className="mt-auto flex gap-2 pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    push('Scene download prepared', {
                      description: `${latestScene.shortId} · 1.2 GB`,
                    })
                  }
                >
                  <Download className="h-3 w-3" />
                  Download
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    navigate('/maps', { state: { layer: 'ndvi' } })
                  }
                >
                  <Map className="h-3 w-3" />
                  Open on map
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col xl:col-span-4">
          <CardHeader
            title="Processing pipeline"
            description="GPU cluster · 4 workers"
            action={
              <Badge
                className="border-brand/30 bg-brand/10 text-brand"
                dot
                dotClassName="bg-brand"
              >
                Live
              </Badge>
            }
          />
          <div className="flex flex-1 flex-col divide-y divide-line">
            {pipelineJobs.map((job) => (
              <div key={job.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[9px] text-subtle">
                    {job.id}
                  </span>
                  <Badge className={jobStatusStyles[job.status]}>
                    {job.status === 'Complete' ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {job.status}
                      </span>
                    ) : (
                      job.status
                    )}
                  </Badge>
                </div>
                <p className="mt-1.5 text-[11px] font-medium text-ink">
                  {job.task}
                </p>
                <p className="mt-0.5 text-[9px] text-subtle">
                  {job.scene} · {job.model}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-elevated">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        job.status === 'Queued' ? 'bg-subtle' : 'bg-brand',
                      )}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <span className="w-7 text-right font-mono text-[9px] text-muted">
                    {job.progress}%
                  </span>
                  <span className="w-9 text-right font-mono text-[9px] text-subtle">
                    {job.eta}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-4 py-2.5">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-subtle">Cluster utilization</span>
              <span className="font-mono text-ink">3 / 4 workers</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-elevated">
              <div className="h-full w-3/4 rounded-full bg-brand" />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Card className="overflow-hidden xl:col-span-8">
          <CardHeader
            title="Scene catalog"
            description="Recent acquisitions and model-ready scenes"
            action={
              <span className="font-mono text-[9px] text-subtle">
                {filteredScenes.length} of {scenes.length}
              </span>
            }
          />
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search scene ID or province…"
                className="input h-7 w-[220px] pl-8 text-[11px]"
                aria-label="Search scenes"
              />
            </div>
            <Select
              value={satellite}
              onChange={(event) => setSatellite(event.target.value)}
              options={satelliteOptions}
              className="w-[136px]"
              selectClassName="h-7 text-[11px]"
              aria-label="Filter satellite"
            />
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              options={sceneStatusOptions}
              className="w-[124px]"
              selectClassName="h-7 text-[11px]"
              aria-label="Filter scene status"
            />
            {(search || satellite !== 'all' || status !== 'all') ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSatellite('all')
                  setStatus('all')
                }}
                className="h-7 rounded-md px-2 text-[10px] text-subtle transition hover:bg-elevated hover:text-ink"
              >
                Clear
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => navigate('/maps')}
              className="ml-auto inline-flex items-center gap-1 text-[10px] text-subtle transition hover:text-ink"
            >
              Open map
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <DataTable
            columns={columns}
            rows={filteredScenes}
            rowKey="id"
            tableClassName="min-w-[900px]"
            emptyState={
              <div className="text-center">
                <p className="text-[12px] font-medium text-ink">
                  No scenes match your filters
                </p>
                <p className="mt-1 text-[11px] text-subtle">
                  Clear filters or try a different satellite.
                </p>
              </div>
            }
          />
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
            <span className="font-mono text-[9px] text-subtle">
              Imagery retention · 18 months
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] text-subtle">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Synced 12 min ago
            </span>
          </div>
        </Card>

        <Card className="flex flex-col xl:col-span-4">
          <CardHeader
            title="Constellation"
            description="Imagery sources available to Region 1"
          />
          <div className="flex flex-1 flex-col divide-y divide-line">
            {constellation.map((source) => (
              <div
                key={source.name}
                className="flex flex-1 items-start gap-2.5 px-4 py-3"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-elevated text-muted">
                  <Satellite className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium text-ink">
                      {source.name}
                    </p>
                    <Badge
                      className={
                        constellationStatusStyles[source.status] ||
                        'border-line bg-elevated text-muted'
                      }
                    >
                      {source.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-[9px] text-subtle">
                    {source.operator}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 font-mono text-[9px] text-subtle">
                    <span>{source.resolution}</span>
                    <span className="text-[#444]">·</span>
                    <span>{source.revisit} revisit</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-line p-3">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => navigate('/settings')}
            >
              Manage data sources
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
