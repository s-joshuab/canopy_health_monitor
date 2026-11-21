import { cn } from '../../lib/utils'

export function Card({ children, className, ...props }) {
  return (
    <section className={cn('surface', className)} {...props}>
      {children}
    </section>
  )
}

export function CardHeader({
  title,
  description,
  action,
  className,
  children,
}) {
  return (
    <div
      className={cn(
        'flex min-h-[58px] items-start justify-between gap-4 border-b border-line px-4 py-3',
        className,
      )}
    >
      <div className="min-w-0">
        {title ? (
          <h2 className="text-[13px] font-medium leading-5 text-ink">{title}</h2>
        ) : null}
        {description ? (
          <p className="mt-0.5 text-[11px] leading-4 text-subtle">{description}</p>
        ) : null}
        {children}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
