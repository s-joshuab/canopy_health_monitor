import { cn } from '../../lib/utils'

export default function Sparkline({
  data,
  color = '#3ecf8e',
  className,
  width = 120,
  height = 34,
  showEndDot = true,
}) {
  if (!data?.length) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padding = 2
  const usableWidth = width - padding * 2
  const usableHeight = height - padding * 2

  const points = data.map((value, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * usableWidth
    const y = padding + (1 - (value - min) / range) * usableHeight
    return [x, y]
  })

  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  const last = points[points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('overflow-visible', className)}
      aria-hidden="true"
    >
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showEndDot ? (
        <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
      ) : null}
    </svg>
  )
}
