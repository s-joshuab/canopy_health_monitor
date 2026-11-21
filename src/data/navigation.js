export const navigationGroups = [
  {
    label: 'Monitoring',
    items: [
      { label: 'Dashboard', to: '/', icon: 'LayoutDashboard', end: true },
      { label: 'Canopy Maps', to: '/maps', icon: 'Map' },
      { label: 'Health Alerts', to: '/alerts', icon: 'BellRing', badge: 12 },
    ],
  },
  {
    label: 'Data',
    items: [
      { label: 'Satellite Data', to: '/satellite', icon: 'Satellite' },
      { label: 'Reports', to: '/reports', icon: 'FileText' },
    ],
  },
  {
    label: 'Configuration',
    items: [{ label: 'Settings', to: '/settings', icon: 'Settings' }],
  },
]

export const pageMeta = {
  '/': { title: 'Dashboard', breadcrumb: 'Dashboard' },
  '/maps': { title: 'Canopy Maps', breadcrumb: 'Canopy Maps' },
  '/alerts': { title: 'Health Alerts', breadcrumb: 'Health Alerts' },
  '/satellite': { title: 'Satellite Data', breadcrumb: 'Satellite Data' },
  '/reports': { title: 'Reports', breadcrumb: 'Reports' },
  '/settings': { title: 'Settings', breadcrumb: 'Settings' },
}

export const commandPages = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Regional canopy overview',
    path: '/',
    group: 'Navigation',
    icon: 'LayoutDashboard',
  },
  {
    id: 'maps',
    label: 'Canopy Maps',
    description: 'Explore canopy density and NDVI',
    path: '/maps',
    group: 'Navigation',
    icon: 'Map',
  },
  {
    id: 'alerts',
    label: 'Health Alerts',
    description: 'Review vegetation health anomalies',
    path: '/alerts',
    group: 'Navigation',
    icon: 'BellRing',
  },
  {
    id: 'satellite',
    label: 'Satellite Data',
    description: 'Scenes, passes and processing',
    path: '/satellite',
    group: 'Navigation',
    icon: 'Satellite',
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'Generate and export analysis',
    path: '/reports',
    group: 'Navigation',
    icon: 'FileText',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Workspace and monitoring configuration',
    path: '/settings',
    group: 'Navigation',
    icon: 'Settings',
  },
  {
    id: 'layer-canopy',
    label: 'Switch to Canopy Density',
    description: 'Canopy Maps · density layer',
    path: '/maps',
    state: { layer: 'canopy' },
    group: 'Map layers',
    icon: 'Layers',
  },
  {
    id: 'layer-ndvi',
    label: 'Switch to NDVI Health',
    description: 'Canopy Maps · vegetation health layer',
    path: '/maps',
    state: { layer: 'ndvi' },
    group: 'Map layers',
    icon: 'Activity',
  },
  {
    id: 'critical-alerts',
    label: 'Open critical alerts',
    description: 'Health Alerts · Critical severity',
    path: '/alerts',
    state: { severity: 'Critical' },
    group: 'Quick actions',
    icon: 'TriangleAlert',
  },
]
