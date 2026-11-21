import { cn } from './utils'

const variants = {
  primary:
    'border-brand bg-brand text-[#0f0f0f] hover:border-brand-hover hover:bg-brand-hover',
  secondary:
    'border-line bg-transparent text-ink hover:border-[#3a3a3a] hover:bg-elevated',
  ghost:
    'border-transparent bg-transparent text-muted hover:bg-elevated hover:text-ink',
  danger:
    'border-health-deforested/40 bg-health-deforested/10 text-health-deforested hover:bg-health-deforested/20',
}

const sizes = {
  sm: 'h-7 gap-1.5 px-2.5 text-[11px]',
  md: 'h-8 gap-2 px-3 text-[12px]',
}

export function buttonClass(variant = 'secondary', size = 'md', className = '') {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-md border font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}
