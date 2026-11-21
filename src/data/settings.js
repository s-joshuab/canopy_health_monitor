export const settingsTabs = [
  { value: 'workspace', label: 'Workspace' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'sources', label: 'Data sources' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'team', label: 'Team' },
]

export const workspaceSettings = {
  projectName: 'Forest Monitor',
  projectId: 'fcm-region-1-ilocos',
  region: 'Region 1 — Ilocos Region',
  timezone: 'Asia/Manila (UTC+08:00)',
  areaUnit: 'Hectares (ha)',
  language: 'English',
  fiscalYear: 'Calendar year',
  defaultMapCenter: '17.5700° N, 120.6200° E',
  defaultZoom: '8',
}

export const monitoringSettings = {
  canopyLossThreshold: 15,
  confidenceThreshold: 85,
  alertSensitivity: 'High',
  modelVersion: 'ResNet-50 v2.4.1',
  segmentationModel: 'U-Net CNN v1.8.0',
  autoAlerts: true,
  includeLowSeverity: false,
  prioritySatellites: ['Sentinel-2A', 'Sentinel-2B', 'Landsat-9'],
}

export const dataSources = [
  {
    id: 'sentinel-2',
    name: 'Sentinel-2',
    provider: 'ESA Copernicus',
    description: '10 m multispectral imagery for canopy and NDVI analysis.',
    status: 'Connected',
    lastSync: '12 min ago',
    icon: 'Satellite',
    scenes: '1,046 scenes',
  },
  {
    id: 'landsat-9',
    name: 'Landsat-9',
    provider: 'NASA / USGS',
    description: '30 m thermal and optical imagery for change detection.',
    status: 'Connected',
    lastSync: '2 days ago',
    icon: 'Orbit',
    scenes: '186 scenes',
  },
  {
    id: 'planetscope',
    name: 'PlanetScope',
    provider: 'Planet Labs',
    description: 'High-resolution daily imagery for field validation.',
    status: 'Tasking',
    lastSync: '8 days ago',
    icon: 'Globe2',
    scenes: '52 scenes',
  },
  {
    id: 'modis',
    name: 'MODIS',
    provider: 'NASA Terra / Aqua',
    description: 'Regional vegetation and fire-risk context layers.',
    status: 'Paused',
    lastSync: '21 days ago',
    icon: 'Flame',
    scenes: '—',
  },
]

export const notificationSettings = {
  criticalAlerts: true,
  weeklyDigest: true,
  canopyThreshold: true,
  reportReady: true,
  productUpdates: false,
  email: 'forest.monitor@denr.gov.ph',
  slackChannel: '#forest-alerts-r1',
  digestDay: 'Monday · 08:00 PHT',
}

export const teamMembers = [
  {
    id: 'USR-001',
    name: 'Alicia Dela Cruz',
    email: 'a.delacruz@denr.gov.ph',
    role: 'Owner',
    status: 'Active',
    initials: 'AD',
    lastActive: 'Now',
  },
  {
    id: 'USR-002',
    name: 'Miguel Bautista',
    email: 'm.bautista@denr.gov.ph',
    role: 'Admin',
    status: 'Active',
    initials: 'MB',
    lastActive: '18 min ago',
  },
  {
    id: 'USR-003',
    name: 'Rina Fernandez',
    email: 'r.fernandez@denr.gov.ph',
    role: 'Analyst',
    status: 'Active',
    initials: 'RF',
    lastActive: '2 hours ago',
  },
  {
    id: 'USR-004',
    name: 'Joshua Sacquiaten',
    email: 'j.sacquiaten@denr.gov.ph',
    role: 'Viewer',
    status: 'Invited',
    initials: 'JS',
    lastActive: 'Pending',
  },
]
