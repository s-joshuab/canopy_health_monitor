export const healthStatus = {
  dense: {
    label: 'Dense Healthy',
    color: '#3ecf8e',
    badge: 'border-brand/30 bg-brand/10 text-brand',
    dot: 'bg-brand',
    soft: 'bg-brand/10',
    text: 'text-brand',
  },
  moderate: {
    label: 'Moderate',
    color: '#a3e635',
    badge: 'border-health-moderate/30 bg-health-moderate/10 text-health-moderate',
    dot: 'bg-health-moderate',
    soft: 'bg-health-moderate/10',
    text: 'text-health-moderate',
  },
  stressed: {
    label: 'Stressed',
    color: '#facc15',
    badge: 'border-health-stressed/30 bg-health-stressed/10 text-health-stressed',
    dot: 'bg-health-stressed',
    soft: 'bg-health-stressed/10',
    text: 'text-health-stressed',
  },
  degraded: {
    label: 'Degraded',
    color: '#fb923c',
    badge: 'border-health-degraded/30 bg-health-degraded/10 text-health-degraded',
    dot: 'bg-health-degraded',
    soft: 'bg-health-degraded/10',
    text: 'text-health-degraded',
  },
  deforested: {
    label: 'Deforested',
    color: '#ef4444',
    badge: 'border-health-deforested/30 bg-health-deforested/10 text-health-deforested',
    dot: 'bg-health-deforested',
    soft: 'bg-health-deforested/10',
    text: 'text-health-deforested',
  },
}

export const healthOrder = ['dense', 'moderate', 'stressed', 'degraded', 'deforested']

export function healthByLabel(label) {
  const key = healthOrder.find(
    (item) => healthStatus[item].label.toLowerCase() === String(label).toLowerCase(),
  )
  return key ? healthStatus[key] : healthStatus.moderate
}

export const severityStyles = {
  Critical: {
    badge: 'border-health-deforested/30 bg-health-deforested/10 text-health-deforested',
    dot: 'bg-health-deforested',
    color: '#ef4444',
  },
  High: {
    badge: 'border-health-degraded/30 bg-health-degraded/10 text-health-degraded',
    dot: 'bg-health-degraded',
    color: '#fb923c',
  },
  Medium: {
    badge: 'border-health-stressed/30 bg-health-stressed/10 text-health-stressed',
    dot: 'bg-health-stressed',
    color: '#facc15',
  },
  Low: {
    badge: 'border-health-moderate/30 bg-health-moderate/10 text-health-moderate',
    dot: 'bg-health-moderate',
    color: '#a3e635',
  },
}

export const alertStatusStyles = {
  Open: 'border-health-deforested/30 bg-health-deforested/10 text-health-deforested',
  Acknowledged: 'border-health-stressed/30 bg-health-stressed/10 text-health-stressed',
  Resolved: 'border-brand/30 bg-brand/10 text-brand',
}

export const reportStatusStyles = {
  Ready: 'border-brand/30 bg-brand/10 text-brand',
  Generating: 'border-health-stressed/30 bg-health-stressed/10 text-health-stressed',
  Failed: 'border-health-deforested/30 bg-health-deforested/10 text-health-deforested',
}

export const sourceStatusStyles = {
  Connected: 'border-brand/30 bg-brand/10 text-brand',
  Tasking: 'border-health-stressed/30 bg-health-stressed/10 text-health-stressed',
  Paused: 'border-line bg-elevated text-muted',
}

export const sourceStatusDots = {
  Connected: 'bg-brand',
  Tasking: 'bg-health-stressed',
  Paused: 'bg-subtle',
}
