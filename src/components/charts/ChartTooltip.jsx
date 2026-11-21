export default function ChartTooltip({
  active,
  payload,
  label,
  units = {},
  names = {},
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="min-w-[150px] rounded-md border border-line bg-panel px-3 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
      {label ? (
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">
          {label}
        </p>
      ) : null}
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div
            key={item.dataKey || item.name}
            className="flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-1.5 text-[11px] text-muted">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    item.color || item.payload?.fill || '#3ecf8e',
                }}
              />
              {names[item.dataKey] || item.name}
            </span>
            <span className="font-mono text-[11px] font-medium text-ink">
              {item.value}
              {units[item.dataKey] || ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
