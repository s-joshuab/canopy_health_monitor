import { useEffect } from 'react'
import {
  CircleMarker,
  MapContainer,
  Polygon,
  Popup,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { healthByLabel, severityStyles } from '../../lib/status'
import { monitoringHotspots } from '../../data/provinces'
import { cn } from '../../lib/utils'

function MapResizer() {
  const map = useMap()

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize({ animate: false })
    })
    observer.observe(map.getContainer())
    const timer = window.setTimeout(() => map.invalidateSize({ animate: false }), 280)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [map])

  return null
}

function MapFocus({
  center,
  zoom,
  enabled,
  fallbackCenter,
  fallbackZoom,
}) {
  const map = useMap()
  const lat = center?.[0]
  const lng = center?.[1]
  const fallbackLat = fallbackCenter?.[0]
  const fallbackLng = fallbackCenter?.[1]

  useEffect(() => {
    if (!enabled) return
    if (lat === undefined || lng === undefined) {
      if (fallbackLat !== undefined && fallbackLng !== undefined) {
        map.flyTo([fallbackLat, fallbackLng], fallbackZoom, { duration: 0.65 })
      }
      return
    }
    map.flyTo([lat, lng], zoom, { duration: 0.65 })
  }, [enabled, fallbackLat, fallbackLng, fallbackZoom, lat, lng, map, zoom])

  return null
}

export default function MonitoringMap({
  provinces,
  selectedProvinceId,
  onSelectProvince,
  layer = 'canopy',
  alerts = [],
  showAlerts = true,
  showHotspots = false,
  showLabels = true,
  center = [17.52, 120.6],
  zoom = 8,
  focusSelected = false,
  height = '100%',
  className,
}) {
  const selectedProvince = provinces.find(
    (province) => province.id === selectedProvinceId,
  )

  return (
    <div
      className={cn('relative h-full w-full overflow-hidden bg-[#edf2ed]', className)}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        zoomControl={false}
        className="h-full w-full"
        minZoom={6}
        maxZoom={15}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={20}
        />
        <ZoomControl position="topright" />
        <MapResizer />
        <MapFocus
          center={selectedProvince?.center}
          zoom={9}
          enabled={focusSelected}
          fallbackCenter={center}
          fallbackZoom={zoom}
        />

        {provinces.map((province) => {
          const selected = province.id === selectedProvinceId
          const value =
            layer === 'ndvi'
              ? province.meanNdvi.toFixed(2)
              : `${province.densePct.toFixed(1)}%`

          return (
            <Polygon
              key={province.id}
              positions={province.polygon}
              pathOptions={{
                color: selected ? '#2f9360' : '#95bda0',
                weight: selected ? 1.8 : 1,
                opacity: selected ? 0.95 : 0.72,
                fillColor: '#86be96',
                fillOpacity: selected ? 0.24 : 0.12,
                dashArray: '4 5',
                lineJoin: 'round',
              }}
              eventHandlers={{
                click: () => onSelectProvince?.(province.id),
                mouseover: (event) => {
                  event.target.setStyle({
                    fillOpacity: selected ? 0.36 : 0.26,
                    weight: selected ? 2 : 1.4,
                  })
                },
                mouseout: (event) => {
                  event.target.setStyle({
                    fillOpacity: selected ? 0.28 : 0.16,
                    weight: selected ? 1.8 : 1,
                  })
                },
              }}
            >
              {showLabels ? (
                <Tooltip
                  permanent
                  direction="center"
                  position={province.labelPosition}
                  className="map-label"
                  opacity={1}
                >
                  <div className="province-map-label">
                    <p className="province-map-label-name">
                      {province.name}
                    </p>
                    <p className="province-map-label-value">
                      {value}
                    </p>
                  </div>
                </Tooltip>
              ) : null}
            </Polygon>
          )
        })}

        {showHotspots
          ? monitoringHotspots.map((hotspot) => {
              const style = healthByLabel(hotspot.status)
              return (
                <CircleMarker
                  key={hotspot.id}
                  center={hotspot.position}
                  radius={4.5}
                  pathOptions={{
                    color: '#ffffff',
                    weight: 1,
                    fillColor: style.color,
                    fillOpacity: 1,
                  }}
                >
                  <Tooltip direction="top" className="map-label" opacity={1}>
                    <div className="rounded border border-line bg-panel px-2 py-1">
                      <p className="text-[10px] text-ink">
                        {hotspot.status} · {hotspot.areaHa} ha
                      </p>
                      <p className="mt-0.5 text-[9px] text-subtle">
                        {hotspot.province}
                      </p>
                    </div>
                  </Tooltip>
                </CircleMarker>
              )
            })
          : null}

        {showAlerts
          ? alerts.map((alert) => {
              const style = severityStyles[alert.severity]
              return (
                <CircleMarker
                  key={alert.id}
                  center={alert.coordinates}
                  radius={alert.severity === 'Critical' ? 6 : 4.5}
                  pathOptions={{
                    color: '#ffffff',
                    weight: 1.5,
                    fillColor: style.color,
                    fillOpacity: 1,
                  }}
                >
                  <Popup>
                    <div className="min-w-[190px]">
                      <p className="font-mono text-[10px] text-subtle">
                        {alert.id}
                      </p>
                      <p className="mt-1 text-[12px] font-medium text-ink">
                        {alert.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {alert.municipality}, {alert.province}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span
                          className="rounded-full border px-1.5 py-0.5 text-[9px]"
                          style={{
                            color: style.color,
                            borderColor: `${style.color}55`,
                            backgroundColor: `${style.color}18`,
                          }}
                        >
                          {alert.severity}
                        </span>
                        <span className="font-mono text-[10px] text-muted">
                          {alert.areaHa} ha
                        </span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })
          : null}
      </MapContainer>
    </div>
  )
}
