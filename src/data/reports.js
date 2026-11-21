export const reportStats = [
  { label: 'Reports generated', value: '24', sub: 'All time' },
  { label: 'Generated this month', value: '6', sub: '+2 vs October' },
  { label: 'Scheduled reports', value: '3', sub: 'Next: Nov 30' },
]

export const reportTemplates = [
  {
    id: 'canopy-summary',
    title: 'Regional Canopy Summary',
    description:
      'Canopy density, vegetation health and province-level trends for Region 1.',
    icon: 'FileBarChart',
    scope: 'Region 1',
    format: 'PDF',
    accent: 'brand',
  },
  {
    id: 'alert-digest',
    title: 'Health Alert Digest',
    description:
      'A prioritized summary of open, acknowledged and resolved health alerts.',
    icon: 'ShieldAlert',
    scope: 'Region 1',
    format: 'PDF',
    accent: 'orange',
  },
  {
    id: 'deforestation-risk',
    title: 'Deforestation Risk Assessment',
    description:
      'Change-detection hotspots, confidence scores and recommended field checks.',
    icon: 'TreePine',
    scope: 'All provinces',
    format: 'PDF',
    accent: 'red',
  },
  {
    id: 'provincial-comparison',
    title: 'Provincial Comparison',
    description:
      'Side-by-side canopy and NDVI indicators across the four provinces.',
    icon: 'Columns3',
    scope: '4 provinces',
    format: 'XLSX',
    accent: 'lime',
  },
]

export const reportHistory = [
  {
    id: 'RPT-2026-041',
    name: 'November Canopy Health Summary',
    type: 'Regional Canopy Summary',
    scope: 'Region 1 · All provinces',
    period: 'Nov 1 – Nov 20, 2026',
    generated: 'Nov 20, 2026 · 09:42',
    by: 'A. Dela Cruz',
    format: 'PDF',
    size: '4.8 MB',
    status: 'Ready',
  },
  {
    id: 'RPT-2026-040',
    name: 'Open Health Alert Digest',
    type: 'Health Alert Digest',
    scope: 'Region 1 · Open alerts',
    period: 'Nov 1 – Nov 19, 2026',
    generated: 'Nov 19, 2026 · 16:18',
    by: 'M. Bautista',
    format: 'PDF',
    size: '2.1 MB',
    status: 'Ready',
  },
  {
    id: 'RPT-2026-039',
    name: 'Pangasinan Deforestation Risk',
    type: 'Deforestation Risk Assessment',
    scope: 'Pangasinan',
    period: 'Oct 1 – Nov 18, 2026',
    generated: 'Nov 18, 2026 · 11:05',
    by: 'R. Fernandez',
    format: 'PDF',
    size: '6.3 MB',
    status: 'Ready',
  },
  {
    id: 'RPT-2026-038',
    name: 'Provincial Comparison · October',
    type: 'Provincial Comparison',
    scope: 'Region 1 · All provinces',
    period: 'Oct 1 – Oct 31, 2026',
    generated: 'Nov 04, 2026 · 08:30',
    by: 'A. Dela Cruz',
    format: 'XLSX',
    size: '1.4 MB',
    status: 'Ready',
  },
  {
    id: 'RPT-2026-037',
    name: 'Ilocos Norte Canopy Snapshot',
    type: 'Regional Canopy Summary',
    scope: 'Ilocos Norte',
    period: 'Oct 1 – Oct 31, 2026',
    generated: 'Nov 02, 2026 · 14:12',
    by: 'M. Bautista',
    format: 'PDF',
    size: '3.9 MB',
    status: 'Ready',
  },
  {
    id: 'RPT-2026-036',
    name: 'Weekly Alert Digest',
    type: 'Health Alert Digest',
    scope: 'Region 1 · Open alerts',
    period: 'Oct 24 – Oct 31, 2026',
    generated: 'Oct 31, 2026 · 17:00',
    by: 'System',
    format: 'PDF',
    size: '—',
    status: 'Failed',
  },
]

export const reportTypeOptions = [
  { value: 'Regional Canopy Summary', label: 'Regional Canopy Summary' },
  { value: 'Health Alert Digest', label: 'Health Alert Digest' },
  { value: 'Deforestation Risk Assessment', label: 'Deforestation Risk Assessment' },
  { value: 'Provincial Comparison', label: 'Provincial Comparison' },
]

export const reportScopeOptions = [
  { value: 'Region 1 · All provinces', label: 'Region 1 · All provinces' },
  { value: 'Ilocos Norte', label: 'Ilocos Norte' },
  { value: 'Ilocos Sur', label: 'Ilocos Sur' },
  { value: 'La Union', label: 'La Union' },
  { value: 'Pangasinan', label: 'Pangasinan' },
]

export const reportStatusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'Ready', label: 'Ready' },
  { value: 'Generating', label: 'Generating' },
  { value: 'Failed', label: 'Failed' },
]
