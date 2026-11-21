import { cn } from '../../lib/utils'

export default function Badge({
  children,
  className,
  dot = false,
  dotClassName,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4',
        className,
      )}
    >
      {dot ? (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClassName)} />
      ) : null}
      {children}
    </span>
  )
}
