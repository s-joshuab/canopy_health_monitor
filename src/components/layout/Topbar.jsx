import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronRight,
  CircleHelp,
  LogOut,
  Menu,
  Search,
  Settings,
  TriangleAlert,
} from 'lucide-react'
import { alerts } from '../../data/alerts'
import { pageMeta } from '../../data/navigation'
import { severityStyles } from '../../lib/status'
import { useToast } from '../ui/toastContext'

export default function Topbar({ onOpenPalette, onOpenMobileSidebar }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { push } = useToast()
  const [menuState, setMenuState] = useState({ type: null, path: null })
  const [unread, setUnread] = useState(true)
  const menuRef = useRef(null)

  const page = pageMeta[location.pathname] || { breadcrumb: 'Dashboard' }
  const openAlerts = alerts.filter((alert) => alert.status === 'Open').slice(0, 4)
  const openMenu =
    menuState.path === location.pathname ? menuState.type : null

  const closeMenu = useCallback(
    () => setMenuState({ type: null, path: null }),
    [],
  )

  const toggleMenu = useCallback(
    (type) => {
      setMenuState((current) => {
        const currentType =
          current.path === location.pathname ? current.type : null
        return {
          type: currentType === type ? null : type,
          path: location.pathname,
        }
      })
    },
    [location.pathname],
  )

  useEffect(() => {
    const handleOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu()
      }
    }
    const handleEscape = (event) => {
      if (event.key === 'Escape') closeMenu()
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [closeMenu])

  return (
    <header className="relative z-20 flex h-12 shrink-0 items-center justify-between border-b border-line bg-canvas px-3 md:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="icon-button -ml-1 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <nav className="flex min-w-0 items-center gap-1.5 text-[12px]">
          <span className="hidden text-subtle sm:inline">Region 1</span>
          <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-[#4a4a4a] sm:block" />
          <span className="truncate font-medium text-ink">{page.breadcrumb}</span>
        </nav>
      </div>

      <div ref={menuRef} className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenPalette}
          className="hidden h-7 w-[240px] items-center gap-2 rounded-md border border-line bg-panel px-2.5 text-left text-[11px] text-subtle transition hover:border-[#3a3a3a] hover:bg-elevated md:flex xl:w-[280px]"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1">Search or jump to…</span>
          <kbd className="inline-flex h-5 items-center rounded border border-line bg-canvas px-1.5 font-mono text-[9px] text-subtle">
            Ctrl K
          </kbd>
        </button>
        <button
          type="button"
          onClick={onOpenPalette}
          className="icon-button md:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu('notifications')}
            className="icon-button relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unread ? (
              <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full border border-canvas bg-health-deforested" />
            ) : null}
          </button>

          {openMenu === 'notifications' ? (
            <div className="absolute right-0 top-[38px] w-[320px] animate-scale-in overflow-hidden rounded-lg border border-line bg-panel shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-[12px] font-medium text-ink">
                    Notifications
                  </h3>
                  <span className="rounded-full border border-line bg-elevated px-1.5 py-0.5 font-mono text-[9px] text-muted">
                    8 open
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUnread(false)
                    push('All notifications marked as read')
                  }}
                  className="text-[10px] text-subtle transition hover:text-ink"
                >
                  Mark all read
                </button>
              </div>
              <div className="divide-y divide-line">
                {openAlerts.map((alert) => {
                  const style = severityStyles[alert.severity]
                  return (
                    <button
                      type="button"
                      key={alert.id}
                      onClick={() => {
                        closeMenu()
                        navigate('/alerts')
                      }}
                      className="flex w-full gap-2.5 px-3.5 py-3 text-left transition hover:bg-elevated"
                    >
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-[11px] font-medium text-ink">
                            {alert.title}
                          </span>
                          <span className="shrink-0 font-mono text-[9px] text-subtle">
                            {alert.severity}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] text-muted">
                          {alert.municipality}, {alert.province}
                        </span>
                        <span className="mt-1 block font-mono text-[9px] text-subtle">
                          {alert.detectedShort} · {alert.areaHa} ha
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  navigate('/alerts')
                }}
                className="flex w-full items-center justify-center gap-1 border-t border-line py-2.5 text-[11px] text-muted transition hover:bg-elevated hover:text-ink"
              >
                View all alerts
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu('help')}
            className="icon-button hidden sm:inline-flex"
            aria-label="Help"
          >
            <CircleHelp className="h-4 w-4" />
          </button>

          {openMenu === 'help' ? (
            <div className="absolute right-0 top-[38px] w-[280px] animate-scale-in rounded-lg border border-line bg-panel p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
              <h3 className="text-[12px] font-medium text-ink">Quick help</h3>
              <p className="mt-1 text-[11px] leading-4 text-muted">
                Use the command palette to move between monitoring views.
              </p>
              <div className="mt-3 space-y-2 border-t border-line pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted">Command palette</span>
                  <kbd className="kbd">Ctrl K</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted">Close dialog</span>
                  <kbd className="kbd">Esc</kbd>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-md border border-line bg-canvas p-2.5">
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-health-stressed" />
                <p className="text-[10px] leading-4 text-subtle">
                  Prototype environment. All imagery, alerts and statistics are
                  mock data.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative ml-0.5">
          <button
            type="button"
            onClick={() => toggleMenu('user')}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-brand/30 bg-brand/10 font-mono text-[10px] font-medium text-brand transition hover:border-brand/50 hover:bg-brand/10"
            aria-label="Account menu"
          >
            JS
          </button>

          {openMenu === 'user' ? (
            <div className="absolute right-0 top-[38px] w-[220px] animate-scale-in overflow-hidden rounded-lg border border-line bg-panel shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
              <div className="border-b border-line px-3.5 py-3">
                <p className="text-[12px] font-medium text-ink">
                  Joshua Sacquiaten
                </p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-subtle">
                  j.sacquiaten@denr.gov.ph
                </p>
              </div>
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    closeMenu()
                    navigate('/settings')
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-muted transition hover:bg-elevated hover:text-ink"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu()
                    onOpenPalette()
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-muted transition hover:bg-elevated hover:text-ink"
                >
                  <Search className="h-3.5 w-3.5" />
                  Command palette
                  <kbd className="kbd ml-auto">Ctrl K</kbd>
                </button>
              </div>
              <div className="border-t border-line p-1">
                <button
                  type="button"
                  onClick={() => {
                    closeMenu()
                    push('Prototype mode — sign out is disabled', {
                      tone: 'error',
                    })
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-muted transition hover:bg-elevated hover:text-ink"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
