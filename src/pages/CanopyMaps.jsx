import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  BellRing,
  Download,
  FileText,
  Layers,
  MapPin,
  Satellite,
  X,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import Select from '../components/ui/Select'
import Toggle from '../components/ui/Toggle'
import MonitoringMap from '../components/map/MonitoringMap'
import { useToast } from '../components/ui/toastContext'
import { alerts } from '../data/alerts'
import { provinceOptions, provinces } from '../data/provinces'
import {
  healthByLabel,
  healthOrder,
  healthStatus,
  severityStyles,
} from '../lib/status'
import { cn, formatNumber } from '../lib/utils'

const layerOptions = [
  { value: 'canopy', label: 'Canopy Density', icon: Layers },
  { value: 'ndvi', label: 'NDVI Health', icon: Activity },
]

export default function CanopyMaps() {
  const location = useLocation()
  const navigate = useNavigate()
  const { push } = useToast()
  const [layer, setLayer] = useState(
    location.state?.layer === 'ndvi' ? 'ndvi' : 'canopy',
  )
  const [selectedProvinceId, setSelectedProvinceId] = useState(
    location.state?.provinceId || null,
  )
  const [showAlerts, setShowAlerts] = useState(true)
  const [showHotspots, setShowHotspots] = useState(true)
  const [showLabels, setShowLabels] = useState(true)

  const selectedProvince = provinces.find(
    (province) => province.id === selectedProvinceId,
  )
  const openAlerts = useMemo(
    () => alerts.filter((alert) => alert.status === 'Open'),
    [],
  )
  const selectedProvinceAlerts = useMemo(
    () =>
      openAlerts.filter(
        (alert) => alert.provinceId === selectedProvinceId,
      ),
    [openAlerts, selectedProvinceId],
  )
  const regionNdvi = useMemo(() => {
    const weighted = provinces.reduce(
      (total, province) => total + province.meanNdvi * province.areaHa,
      0,
    )
    return weighted / provinces.reduce((total, province) => total + province.areaHa, 0)
  }, [])

  const layerLabel =
    layer === 'canopy' ? 'Canopy density' : 'NDVI vegetation health'
  const activeLayer = layerOptions.find((item) => item.value === layer)

  return (
    <div>
      <PageHeader
        title="Canopy Maps"
        meta={
          <Badge
            className="border-brand/30 bg-brand/10 text-brand"
            dot
            dotClassName="bg-brand"
          >
            Sentinel-2B
          </Badge>
        }
        description="Explore canopy density and vegetation health across Region 1's 22,100 monitored hectares."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() =>
                push('GeoTIFF export queued', {
                  description: 'Mock export · Region 1 canopy density · 10 m',
                })
              }
            >
              <Download className="h-3.5 w-3.5" />
              Export GeoTIFF
            </Button>
            <Button variant="primary" onClick={() => navigate('/satellite')}>
              <Satellite className="h-3.5 w-3.5" />
              Request capture
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="flex h-[680px] flex-col overflow-hidden xl:h-[calc(100vh-188px)] xl:min-h-[610px]">
          <div className="flex flex-wrap items-center justify-between gap-x-4 border-b border-line px-3">
            <div className="flex items-stretch gap-5">
              {layerOptions.map((item) => {
                const Icon = item.icon
                const active = layer === item.value
                return (
                  <button
                    type="button"
                    key={item.value}
                    onClick={() => setLayer(item.value)}
                    className={cn(
                      'relative flex items-center gap-1.5 py-3 text-[11px] transition',
                      active ? 'text-ink' : 'text-subtle hover:text-muted',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-3.5 w-3.5',
                        active ? 'text-brand' : 'text-subtle',
                      )}
                    />
                    {item.label}
                    {active ? (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand" />
                    ) : null}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 py-1.5">
              <Select
                value={selectedProvinceId || 'all'}
                onChange={(event) =>
                  setSelectedProvinceId(
                    event.target.value === 'all' ? null : event.target.value,
                  )
                }
                options={provinceOptions}
                className="w-[148px]"
                selectClassName="h-7 text-[11px]"
                aria-label="Filter province"
              />
              <button
                type="button"
                onClick={() => setShowAlerts((value) => !value)}
                className={cn(
                  'inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-[10px] transition',
                  showAlerts
                    ? 'border-brand/30 bg-brand/10 text-brand'
                    : 'border-line text-subtle hover:bg-elevated hover:text-ink',
                )}
              >
                <BellRing className="h-3 w-3" />
                Alerts
                <span className="font-mono text-[9px] opacity-70">
                  {openAlerts.length}
                </span>
              </button>
            </div>
          </div>

          <div className="relative min-h-[520px] flex-1 overflow-hidden">
            <MonitoringMap
              provinces={provinces}
              selectedProvinceId={selectedProvinceId}
              onSelectProvince={setSelectedProvinceId}
              layer={layer}
              alerts={openAlerts}
              showAlerts={showAlerts}
              showHotspots={showHotspots}
              showLabels={showLabels}
              focusSelected
              center={[17.52, 120.6]}
              zoom={8}
              height="100%"
            />

            <div className="absolute left-3 top-3 z-[500] flex items-center gap-2 rounded-md border border-line bg-panel/95 px-2.5 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="font-mono text-[9px] text-muted">
                {layerLabel} · 10 m · Nov 18, 2026
              </span>
            </div>

            <div className="absolute bottom-3 left-3 z-[500] w-[184px] rounded-md border border-line bg-panel/95 p-2.5 backdrop-blur">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-subtle">
                  {layer === 'canopy' ? 'Density class' : 'NDVI class'}
                </p>
                <span className="font-mono text-[8px] text-subtle">
                  {layer === 'canopy' ? '% cover' : 'index'}
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {healthOrder.map((key) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: healthStatus[key].color }}
                    />
                    <span className="text-[9px] text-muted">
                      {healthStatus[key].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2 font-mono text-[9px] text-subtle">
            <span>
              Center 17.5200° N, 120.6000° E · OpenStreetMap
            </span>
            <span>{selectedProvince?.name || 'Region 1'} · Mock layer</span>
          </div>
        </Card>

        <aside className="space-y-3">
          {selectedProvince ? (
            <Card>
              <CardHeader
                title={selectedProvince.name}
                description={`${formatNumber(selectedProvince.areaHa)} ha monitored · ${selectedProvince.capital}`}
                action={
                  <button
                    type="button"
                    onClick={() => setSelectedProvinceId(null)}
                    className="icon-button -mr-1.5 -mt-1 h-7 w-7"
                    aria-label="Clear province selection"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                }
              />
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    className={healthByLabel(selectedProvince.canopyStatus).badge}
                    dot
                    dotClassName={
                      healthByLabel(selectedProvince.canopyStatus).dot
                    }
                  >
                    {selectedProvince.canopyStatus}
                  </Badge>
                  <span className="font-mono text-[9px] text-subtle">
                    {selectedProvince.code}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                      Dense canopy
                    </p>
                    <p className="mt-1 font-mono text-[18px] leading-none text-brand">
                      {selectedProvince.densePct.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                      At-risk area
                    </p>
                    <p className="mt-1 font-mono text-[18px] leading-none text-health-degraded">
                      {formatNumber(selectedProvince.atRiskHa)}
                      <span className="ml-1 text-[10px] text-subtle">ha</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                      Mean NDVI
                    </p>
                    <p className="mt-1 font-mono text-[18px] leading-none text-ink">
                      {selectedProvince.meanNdvi.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                      Open alerts
                    </p>
                    <p
                      className={cn(
                        'mt-1 font-mono text-[18px] leading-none',
                        selectedProvinceAlerts.length
                          ? 'text-health-deforested'
                          : 'text-brand',
                      )}
                    >
                      {selectedProvinceAlerts.length}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-line pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-subtle">
                      Canopy class distribution
                    </p>
                    <span className="font-mono text-[9px] text-subtle">%</span>
                  </div>
                  <div className="mt-2.5 space-y-2.5">
                    {selectedProvince.classes.map((item) => (
                      <div key={item.key}>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[10px] text-muted">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                backgroundColor: healthStatus[item.key].color,
                              }}
                            />
                            {healthStatus[item.key].label}
                          </span>
                          <span className="font-mono text-[9px] text-ink">
                            {item.pct.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-elevated">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.pct}%`,
                              backgroundColor: healthStatus[item.key].color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-line pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-subtle">
                      Active alerts
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/alerts')}
                      className="text-[9px] text-brand transition hover:text-brand-hover"
                    >
                      View all
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {selectedProvinceAlerts.slice(0, 3).map((alert) => {
                      const style = severityStyles[alert.severity]
                      return (
                        <button
                          type="button"
                          key={alert.id}
                          onClick={() => navigate('/alerts')}
                          className="flex w-full items-start gap-2 rounded-md border border-line bg-canvas/40 px-2 py-1.5 text-left transition hover:bg-elevated"
                        >
                          <span
                            className={cn(
                              'mt-1 h-1.5 w-1.5 shrink-0 rounded-full',
                              style.dot,
                            )}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[10px] text-ink">
                              {alert.title}
                            </span>
                            <span className="mt-0.5 block truncate text-[9px] text-subtle">
                              {alert.municipality} · {alert.areaHa} ha
                            </span>
                          </span>
                        </button>
                      )
                    })}
                    {!selectedProvinceAlerts.length ? (
                      <p className="rounded-md border border-line bg-canvas/40 px-2 py-3 text-center text-[10px] text-subtle">
                        No open alerts in this province.
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-[9px] text-subtle">
                  <Satellite className="h-3 w-3" />
                  Last pass {selectedProvince.lastPass}
                </div>
              </div>
              <div className="flex gap-2 border-t border-line p-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    push(`${selectedProvince.name} report queued`, {
                      description: 'Mock report · canopy and health summary',
                    })
                  }
                >
                  <FileText className="h-3 w-3" />
                  Province report
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate('/alerts')}
                >
                  View alerts
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <CardHeader
                title="Region overview"
                description="Select a province to inspect canopy health."
                action={
                  <MapPin className="h-3.5 w-3.5 text-subtle" />
                }
              />
              <div className="p-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                      Monitored
                    </p>
                    <p className="mt-1 font-mono text-[18px] leading-none text-ink">
                      22,100
                      <span className="ml-1 text-[10px] text-subtle">ha</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                      Dense canopy
                    </p>
                    <p className="mt-1 font-mono text-[18px] leading-none text-brand">
                      65.2%
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                      At-risk area
                    </p>
                    <p className="mt-1 font-mono text-[18px] leading-none text-health-degraded">
                      3,980
                      <span className="ml-1 text-[10px] text-subtle">ha</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-subtle">
                      Mean NDVI
                    </p>
                    <p className="mt-1 font-mono text-[18px] leading-none text-ink">
                      {regionNdvi.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-line pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-subtle">
                      Provinces
                    </p>
                    <span className="font-mono text-[9px] text-subtle">
                      dense %
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {provinces.map((province) => (
                      <button
                        type="button"
                        key={province.id}
                        onClick={() => setSelectedProvinceId(province.id)}
                        className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition hover:bg-elevated"
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: healthByLabel(
                              province.canopyStatus,
                            ).color,
                          }}
                        />
                        <span className="min-w-0 flex-1 truncate text-[11px] text-ink">
                          {province.name}
                        </span>
                        {province.alerts ? (
                          <span className="font-mono text-[9px] text-health-degraded">
                            {province.alerts}
                          </span>
                        ) : null}
                        <span className="w-10 text-right font-mono text-[9px] text-subtle">
                          {province.densePct.toFixed(1)}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader
              title="Display"
              description={activeLayer?.label}
              className="min-h-[48px] py-2.5"
            />
            <div className="divide-y divide-line">
              <div className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-[11px] text-ink">Active alerts</p>
                  <p className="mt-0.5 text-[9px] text-subtle">
                    Show open detections
                  </p>
                </div>
                <Toggle
                  checked={showAlerts}
                  onChange={setShowAlerts}
                  label="Toggle active alerts"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-[11px] text-ink">Anomaly zones</p>
                  <p className="mt-0.5 text-[9px] text-subtle">
                    Highlight change hotspots
                  </p>
                </div>
                <Toggle
                  checked={showHotspots}
                  onChange={setShowHotspots}
                  label="Toggle anomaly zones"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-[11px] text-ink">Province labels</p>
                  <p className="mt-0.5 text-[9px] text-subtle">
                    Show names and values
                  </p>
                </div>
                <Toggle
                  checked={showLabels}
                  onChange={setShowLabels}
                  label="Toggle province labels"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-[11px] text-ink">Basemap</p>
                  <p className="mt-0.5 text-[9px] text-subtle">
                    OpenStreetMap
                  </p>
                </div>
                <span className="h-5 w-5 rounded border border-line bg-[#edf2ed]" />
              </div>
            </div>
          </Card>

          <div className="rounded-md border border-line bg-panel px-3 py-2.5">
            <p className="text-[9px] leading-4 text-subtle">
              Mock canopy layer derived from Sentinel-2B imagery. Not for
              operational or legal boundary determinations.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
