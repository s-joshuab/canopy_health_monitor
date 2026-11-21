import { buttonClass } from '../../lib/buttonStyles'

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      {...props}
    >
      {children}
    </button>
  )
}
