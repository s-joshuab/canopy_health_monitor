import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  BellRing,
  Check,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Leaf,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  Satellite,
  Settings,
} from 'lucide-react'
import { navigationGroups } from '../../data/navigation'
import { cn } from '../../lib/utils'

const iconMap = {
  LayoutDashboard,
  Map,
  BellRing,
  Satellite,
  FileText,
  Settings,
}

export default function Sidebar({ collapsed, onToggle, onNavigate }) {
  const [projectOpen, setProjectOpen] = useState(false)
  const projectRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleOutside = (event) => {
      if (projectRef.current && !projectRef.current.contains(event.target)) {
        setProjectOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <aside
      className={cn(
        'relative z-30 flex h-full shrink-0 flex-col border-r border-line bg-canvas transition-[width] duration-200',
        collapsed ? 'w-14' : 'w-[220px]',
      )}
    >
      <div
        className={cn(
          'relative flex h-12 shrink-0 items-center border-b border-line',
          collapsed ? 'justify-center px-2' : 'px-2.5',
        )}
        ref={projectRef}
      >
        <button
          type="button"
          onClick={() => setProjectOpen((open) => !open)}
          className={cn(
            'flex items-center rounded-md transition hover:bg-elevated',
            collapsed
              ? 'h-8 w-8 justify-center'
              : 'w-full gap-2 px-1.5 py-1.5',
          )}
          aria-label="Switch project"
          aria-expanded={projectOpen}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/30 bg-brand/10 text-brand">
            <Leaf className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
          {!collapsed ? (
            <>
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-[12px] font-medium leading-4 text-ink">
                  Forest Monitor
                </span>
                <span className="block truncate text-[10px] leading-4 text-subtle">
                  Region 1
                </span>
              </span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 shrink-0 text-subtle transition',
                  projectOpen && 'rotate-180',
                )}
              />
            </>
          ) : null}
        </button>

        {projectOpen ? (
          <div className="absolute left-2 top-[52px] z-50 w-[236px] animate-scale-in rounded-lg border border-line bg-panel p-1 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
            <p className="px-2 pb-1.5 pt-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-subtle">
              Projects
            </p>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md bg-brand/10 px-2 py-2 text-left"
              onClick={() => setProjectOpen(false)}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-brand/30 bg-brand/10 text-brand">
                <Leaf className="h-3 w-3" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-medium text-brand">
                  Region 1
                </span>
                <span className="block text-[10px] text-muted">
                  Ilocos Region
                </span>
              </span>
              <Check className="h-3.5 w-3.5 text-brand" />
            </button>
            <button
              type="button"
              disabled
              className="mt-0.5 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left opacity-50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-line bg-elevated text-subtle">
                <Leaf className="h-3 w-3" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] text-ink">
                  Region 2
                </span>
                <span className="block text-[10px] text-subtle">
                  Cagayan Valley
                </span>
              </span>
              <span className="text-[9px] text-subtle">Soon</span>
            </button>
            <div className="my-1 border-t border-line" />
            <button
              type="button"
              onClick={() => {
                setProjectOpen(false)
                onNavigate?.()
                navigate('/settings')
              }}
              className="flex w-full items-center rounded-md px-2 py-1.5 text-[11px] text-muted transition hover:bg-elevated hover:text-ink"
            >
              Manage regions
            </button>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navigationGroups.map((group, groupIndex) => (
          <div key={group.label} className={cn(groupIndex > 0 && 'mt-5')}>
            {!collapsed ? (
              <p className="px-2 pb-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-subtle">
                {group.label}
              </p>
            ) : (
              <div className="mx-2 mb-2 border-t border-line" />
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon]
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={collapsed ? item.label : undefined}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'nav-item relative',
                        isActive && 'nav-item-active',
                        collapsed && 'justify-center px-0',
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    {!collapsed ? (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge ? (
                          <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-brand/20 bg-brand/10 px-1 font-mono text-[9px] leading-none text-brand">
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    ) : item.badge ? (
                      <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-health-deforested" />
                    ) : null}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-2">
        {!collapsed ? (
          <div className="mb-2 rounded-md border border-line bg-panel px-2.5 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_0_3px_rgba(62,207,142,0.08)]" />
              <span className="text-[10px] font-medium text-ink">
                All systems operational
              </span>
            </div>
            <p className="mt-1 font-mono text-[9px] text-subtle">
              Last sync · 12 min ago
            </p>
          </div>
        ) : (
          <div className="mb-2 flex justify-center">
            <span
              className="h-1.5 w-1.5 rounded-full bg-brand"
              title="All systems operational"
            />
          </div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex h-7 w-full items-center gap-2 rounded-md px-2 text-[11px] text-subtle transition hover:bg-elevated hover:text-ink',
            collapsed && 'justify-center px-0',
          )}
          title={collapsed ? 'Expand sidebar' : undefined}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
