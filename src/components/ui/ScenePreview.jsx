import { useState } from 'react'
import { cn } from '../../lib/utils'

const sceneImageUrl =
  'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=360&WIDTH=640&SRS=EPSG:4326&BBOX=119.65,15.3,121.45,16.35&TIME=2026-11-18'

export default function ScenePreview({ className }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[#0c1410]',
        className,
      )}
    >
      <img
        src={sceneImageUrl}
        alt="NASA Terra MODIS true-color satellite image over Pangasinan, Philippines, captured November 18, 2026"
        className={cn('h-full w-full object-cover', imageFailed && 'hidden')}
        onError={() => setImageFailed(true)}
      />
      {imageFailed ? (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs text-white/70">
          Satellite imagery is temporarily unavailable.
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20">
          <div className="absolute left-2.5 top-2.5 rounded border border-white/10 bg-black/45 px-1.5 py-0.5 font-mono text-[8px] text-white/80">
            Reference · NASA GIBS MODIS Terra
          </div>
          <div className="absolute right-2.5 top-2.5 rounded border border-white/10 bg-black/45 px-1.5 py-0.5 font-mono text-[8px] text-white/70">
            True color
          </div>
          <div className="absolute bottom-2.5 left-2.5 rounded border border-white/10 bg-black/45 px-1.5 py-0.5 font-mono text-[8px] text-white/70">
            250 m · 2026-11-18
          </div>
          <div className="absolute bottom-2.5 right-2.5 rounded border border-white/10 bg-black/45 px-1.5 py-0.5 font-mono text-[8px] text-white/70">
            Pangasinan · Region I
          </div>
        </div>
      )}
    </div>
  )
}
