import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import CanopyMaps from './pages/CanopyMaps'
import HealthAlerts from './pages/HealthAlerts'
import SatelliteData from './pages/SatelliteData'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/maps" element={<CanopyMaps />} />
        <Route path="/alerts" element={<HealthAlerts />} />
        <Route path="/satellite" element={<SatelliteData />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
