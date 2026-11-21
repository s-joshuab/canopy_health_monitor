import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import CommandPalette from './CommandPalette'
import { pageMeta } from '../../data/navigation'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(
    () => window.localStorage.getItem('forest-sidebar-collapsed') === 'true',
  )
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const mainRef = useRef(null)
  const location = useLocation()

  const closePalette = useCallback(() => setPaletteOpen(false), [])

  useEffect(() => {
    window.localStorage.setItem('forest-sidebar-collapsed', String(collapsed))
  }, [collapsed])

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
    const page = pageMeta[location.pathname]
    document.title = page
      ? `${page.title} · Forest Monitor`
      : 'Forest Monitor — Region 1'
  }, [location.key, location.pathname])

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <div className="hidden h-full shrink-0 lg:flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-[220px] animate-fade-in">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-4 md:p-6">
            <Outlet key={location.key} />
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette open onClose={closePalette} />
      ) : null}
    </div>
  )
}
