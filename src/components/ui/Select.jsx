import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Select({
  value,
  onChange,
  options,
  className,
  selectClassName,
  ...props
}) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={onChange}
        className={cn('input cursor-pointer appearance-none pr-7', selectClassName)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
    </div>
  )
}
