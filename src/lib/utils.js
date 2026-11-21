export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatNumber(value, options = {}) {
  return new Intl.NumberFormat('en-US', options).format(value)
}

export function formatHa(value) {
  return `${formatNumber(value)} ha`
}

export function formatPct(value, digits = 1) {
  return `${Number(value).toFixed(digits)}%`
}

export function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
