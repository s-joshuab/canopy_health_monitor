import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  CalendarDays,
  Download,
  Leaf,
  RefreshCw,
  Satellite,
  Sparkles,
  TreePine,
  TriangleAlert,
  TrendingDown,
} from 'lucide-react'
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import DataTable from '../components/ui/DataTable'
import Select from '../components/ui/Select'
import MonitoringMap from '../components/map/MonitoringMap'
import ChartTooltip from '../components/charts/ChartTooltip'
import {
  canopyTrend,
  dashboardStats,
  healthDistribution,
  satellitePasses,
  trendRanges,
} from '../data/dashboard'
import { alerts } from '../data/alerts'
import { provinces } from '../data/provinces'
import {
  healthByLabel,
  healthOrder,
  healthStatus,
  severityStyles,
} from '../lib/status'
import { cn, formatNumber } from '../lib/utils'
import { useToast } from '../components/ui/toastContext'

const statIcons = {
  Trees: TreePine,
  Leaf,
  TriangleAlert,
  BellRing,
}

const valueTones = {
  default: 'text-ink',
  brand: 'text-brand',
  warning: 'text-health-degraded',
  danger: 'text-health-deforested',
}

const rangeOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

function StatCard({ stat }) {
  const Icon = statIcons[stat.icon] || Leaf
  const DeltaIcon = stat.delta.startsWith('-')
    ? ArrowDownRight
    : ArrowUpRight

  return (
    <div className="surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted">{stat.label}</span>
        <Icon className="h-3.5 w-3.5 text-subtle" strokeWidth={1.8} />
      </div>
      <div className="mt-3 flex items-end gap-1.5">
        <span
          className={cn(
            'font-mono text-[26px] font-medium leading-none tracking-[-0.05em]',
            valueTones[stat.valueTone],
          )}
        >
          {stat.value}
        </span>
        {stat.unit ? (
          <span className="mb-0.5 text-[11px] text-subtle">{stat.unit}</span>
        ) : null}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="truncate text-[10px] text-subtle">{stat.sub}</span>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-0.5 font-mono text-[10px]',
            stat.deltaTone === 'positive'
              ? 'text-brand'
              : 'text-health-deforested',
          )}
        >
          <DeltaIcon className="h-3 w-3" />
          {stat.delta}
        </span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [range, setRange] = useState('30d')
  const [trendRange, setTrendRange] = useState('12M')
  const [refreshing, setRefreshing] = useState(false)
  const navigate = useNavigate()
  const { push } = useToast()

  const openAlerts = useMemo(
    () => alerts.filter((alert) => alert.status === 'Open'),
    [],
  )
  const recentAlerts = openAlerts.slice(0, 4)
  const chartData = useMemo(() => {
    const count =
      trendRanges.find((item) => item.value === trendRange)?.count || 12
    return canopyTrend.slice(-count)
  }, [trendRange])

  const handleRefresh = () => {
    setRefreshing(true)
    window.setTimeout(() => {
      setRefreshing(false)
      push('Dashboard refreshed', {
        description: 'Latest processed pass: Sentinel-2B · Nov 18, 2026',
      })
    }, 700)
  }

  const provinceColumns = [
    {
      key: 'name',
      header: 'Province',
      render: (row) => (
        <div>
          <p className="text-[12px] font-medium text-ink">{row.name}</p>
          <p className="mt-0.5 font-mono text-[9px] text-subtle">
            {row.code} · {row.capital}
          </p>
        </div>
      ),
    },
    {
      key: 'areaHa',
      header: 'Monitored',
      className: 'font-mono text-[11px] text-ink',
      render: (row) => `${formatNumber(row.areaHa)} ha`,
    },
    {
      key: 'densePct',
      header: 'Dense canopy',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-1 w-16 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${row.densePct}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-ink">
            {row.densePct.toFixed(1)}%
          </span>
        </div>
      ),
    },
    {
      key: 'atRiskHa',
      header: 'At-risk',
      className: 'font-mono text-[11px] text-health-degraded',
      render: (row) => `${formatNumber(row.atRiskHa)} ha`,
    },
    {
      key: 'alerts',
      header: 'Alerts',
      render: (row) => (
        <span
          className={cn(
            'font-mono text-[11px]',
            row.alerts >= 4 ? 'text-health-deforested' : 'text-ink',
          )}
        >
          {row.alerts}
        </span>
      ),
    },
    {
      key: 'trend',
      header: 'Trend',
      render: (row) => (
        <span
          className={cn(
            'inline-flex items-center gap-0.5 font-mono text-[10px]',
            row.trend >= 0 ? 'text-brand' : 'text-health-degraded',
          )}
        >
          {row.trend >= 0 ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(row.trend).toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const status = healthByLabel(row.canopyStatus)
        return (
          <Badge className={status.badge} dot dotClassName={status.dot}>
            {row.canopyStatus}
          </Badge>
        )
      },
    },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        meta={
          <Badge
            className="border-brand/30 bg-brand/10 text-brand"
            dot
            dotClassName="bg-brand"
          >
            Live
          </Badge>
        }
        description="Satellite-derived canopy density and vegetation health intelligence for the Ilocos Region."
        actions={
          <>
            <button
              type="button"
              onClick={handleRefresh}
              className="icon-button border border-line bg-panel"
              aria-label="Refresh dashboard"
              title="Refresh dashboard"
            >
              <RefreshCw
                className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')}
              />
            </button>
            <Select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              options={rangeOptions}
              className="w-[132px]"
              aria-label="Date range"
            />
            <Button
              variant="secondary"
              onClick={() =>
                push('Dashboard export prepared', {
                  description: 'Mock CSV export · Region 1 canopy summary',
                })
              }
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button variant="primary" onClick={() => navigate('/reports')}>
              <Sparkles className="h-3.5 w-3.5" />
              Generate report
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Card className="flex flex-col xl:col-span-8">
          <CardHeader
            title="Canopy cover trend"
            description="Dense canopy average vs. at-risk area · Sentinel-2 NDVI composites"
            action={
              <div className="flex items-center gap-4">
                {trendRanges.map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => setTrendRange(item.value)}
                    className={cn(
                      'relative pb-0.5 text-[11px] transition',
                      trendRange === item.value
                        ? 'text-ink'
                        : 'text-subtle hover:text-muted',
                    )}
                  >
                    {item.label}
                    {trendRange === item.value ? (
                      <span className="absolute inset-x-0 -bottom-[5px] h-px bg-brand" />
                    ) : null}
                  </button>
                ))}
              </div>
            }
          />
          <div className="min-h-[260px] flex-1 px-1 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
              >
                <CartesianGrid
                  stroke="#d9e3da"
                  strokeDasharray="3 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                  interval={Math.max(Math.floor(chartData.length / 6), 1)}
                  tick={{ fill: '#6b6b6b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  yAxisId="left"
                  domain={[61, 66]}
                  tickLine={false}
                  axisLine={false}
                  width={38}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: '#6b6b6b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis yAxisId="right" hide domain={[3500, 5000]} />
                <Tooltip
                  content={
                    <ChartTooltip
                      units={{ dense: '%', atRisk: ' ha' }}
                      names={{ dense: 'Dense canopy', atRisk: 'At-risk area' }}
                    />
                  }
                  cursor={{ stroke: '#3a3a3a', strokeDasharray: '3 3' }}
                />
                <Bar
                  yAxisId="right"
                  dataKey="atRisk"
                  fill="#fb923c"
                  fillOpacity={0.48}
                  barSize={8}
                  radius={[2, 2, 0, 0]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="dense"
                  stroke="#3ecf8e"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: '#3ecf8e',
                    stroke: '#1c1c1c',
                    strokeWidth: 2,
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[10px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Dense canopy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-health-degraded" />
              At-risk area
            </span>
            <span className="ml-auto font-mono text-[9px] text-subtle">
              {chartData[chartData.length - 1]?.dense.toFixed(1)}% · Nov 2026
            </span>
          </div>
        </Card>

        <Card className="flex flex-col xl:col-span-4">
          <CardHeader
            title="Vegetation health"
            description="Area by canopy class · 22,100 ha"
            action={
              <Link
                to="/maps"
                className="inline-flex items-center gap-1 text-[10px] text-subtle transition hover:text-ink"
              >
                Map
                <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="flex flex-1 flex-col p-4">
            <div className="relative mx-auto h-[156px] w-[156px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDistribution}
                    dataKey="areaHa"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {healthDistribution.map((item) => (
                      <Cell
                        key={item.key}
                        fill={healthStatus[item.key].color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <ChartTooltip
                        units={{ areaHa: ' ha' }}
                        names={{ areaHa: 'Area' }}
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-[19px] font-medium leading-none text-ink">
                  22.1k
                </span>
                <span className="mt-1 text-[8px] uppercase tracking-[0.12em] text-subtle">
                  hectares
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {healthDistribution.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-2 text-[11px]"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: healthStatus[item.key].color,
                      }}
                    />
                    <span className="truncate text-muted">{item.name}</span>
                  </span>
                  <span className="w-10 text-right font-mono text-[10px] text-ink">
                    {item.pct.toFixed(1)}%
                  </span>
                  <span className="w-14 text-right font-mono text-[9px] text-subtle">
                    {formatNumber(item.areaHa)} ha
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-auto flex items-start gap-2 rounded-md border border-health-degraded/20 bg-health-degraded/5 p-2.5">
              <TrendingDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-health-degraded" />
              <p className="text-[10px] leading-4 text-muted">
                At-risk area is down{' '}
                <span className="font-mono text-health-degraded">2.8%</span>{' '}
                from last quarter.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Card className="flex flex-col xl:col-span-7">
          <CardHeader
            title="Regional monitoring map"
            description="Canopy density · Sentinel-2B · 10 m resolution"
            action={
              <Link
                to="/maps"
                className="inline-flex items-center gap-1 text-[10px] text-subtle transition hover:text-ink"
              >
                Open map
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="relative min-h-[330px] flex-1 overflow-hidden rounded-b-lg">
            <MonitoringMap
              provinces={provinces}
              layer="canopy"
              alerts={openAlerts}
              height="100%"
              showAlerts
              showLabels
              onSelectProvince={(provinceId) =>
                navigate('/maps', {
                  state: { provinceId, layer: 'canopy' },
                })
              }
            />
            <div className="absolute bottom-3 left-3 z-[500] rounded-md border border-line bg-panel/95 px-2.5 py-2 backdrop-blur">
              <p className="mb-1.5 text-[8px] font-medium uppercase tracking-[0.12em] text-subtle">
                Canopy density
              </p>
              <div className="flex items-center gap-3">
                {healthOrder.slice(0, 4).map((key) => (
                  <span
                    key={key}
                    className="flex items-center gap-1 text-[9px] text-muted"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: healthStatus[key].color }}
                    />
                    {healthStatus[key].label.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col xl:col-span-5">
          <CardHeader
            title="Recent alerts"
            description="Highest severity open detections"
            action={
              <Link
                to="/alerts"
                className="inline-flex items-center gap-1 text-[10px] text-subtle transition hover:text-ink"
              >
                View all 12
                <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="flex flex-1 flex-col divide-y divide-line">
            {recentAlerts.map((alert) => {
              const style = severityStyles[alert.severity]
              return (
                <button
                  type="button"
                  key={alert.id}
                  onClick={() => navigate('/alerts')}
                  className="flex flex-1 items-start gap-3 px-4 py-3 text-left transition hover:bg-elevated/60"
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border',
                      style.badge,
                    )}
                  >
                    <TriangleAlert className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className="truncate text-[12px] font-medium text-ink">
                        {alert.title}
                      </span>
                      <Badge className={style.badge}>{alert.severity}</Badge>
                    </span>
                    <span className="mt-1 block text-[10px] text-muted">
                      {alert.municipality}, {alert.province}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 font-mono text-[9px] text-subtle">
                      {alert.id}
                      <span className="text-[#444]">·</span>
                      {alert.detectedShort}
                      <span className="text-[#444]">·</span>
                      {alert.areaHa} ha
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
            <span className="text-[10px] text-subtle">
              <span className="text-health-deforested">3 critical</span> require
              immediate review
            </span>
            <Link
              to="/alerts"
              className="text-[10px] text-brand transition hover:text-brand-hover"
            >
              Review alerts
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader
            title="Province breakdown"
            description="Canopy health indicators across the Ilocos Region"
            action={
              <span className="flex items-center gap-1.5 font-mono text-[9px] text-subtle">
                <CalendarDays className="h-3 w-3" />
                Nov 2026
              </span>
            }
          />
          <DataTable
            columns={provinceColumns}
            rows={provinces}
            onRowClick={(row) =>
              navigate('/maps', {
                state: { provinceId: row.id, layer: 'canopy' },
              })
            }
            tableClassName="min-w-[720px]"
          />
        </Card>

        <Card className="flex flex-col xl:col-span-4">
          <CardHeader
            title="Satellite activity"
            description="Most recent processed acquisitions"
            action={
              <Link
                to="/satellite"
                className="inline-flex items-center gap-1 text-[10px] text-subtle transition hover:text-ink"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <div className="flex flex-1 flex-col divide-y divide-line">
            {satellitePasses.map((pass) => (
              <div
                key={pass.id}
                className="flex flex-1 items-start gap-2.5 px-4 py-3"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-elevated text-muted">
                  <Satellite className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium text-ink">
                      {pass.satellite}
                    </p>
                    <span className="shrink-0 font-mono text-[9px] text-subtle">
                      {pass.time}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[10px] text-muted">
                    {pass.label} · {pass.province}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Badge className="border-brand/30 bg-brand/10 text-brand">
                      {pass.status}
                    </Badge>
                    <span className="font-mono text-[9px] text-subtle">
                      Cloud {pass.cloud}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[10px]">
            <span className="text-subtle">Next Sentinel-2B pass</span>
            <span className="font-mono text-ink">in 2h 18m</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
