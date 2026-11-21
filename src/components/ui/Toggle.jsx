import { cn } from '../../lib/utils'

export default function Toggle({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition focus-visible:ring-1 focus-visible:ring-brand/40',
        checked
          ? 'border-brand/40 bg-brand/25'
          : 'border-line bg-elevated hover:border-[#3a3a3a]',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span
        className={cn(
          'inline-block h-3.5 w-3.5 rounded-full transition',
          checked ? 'translate-x-[17px] bg-brand' : 'translate-x-[3px] bg-subtle',
        )}
      />
    </button>
  )
}
