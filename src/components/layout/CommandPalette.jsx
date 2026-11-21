import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BellRing,
  CornerDownLeft,
  FileText,
  Layers,
  LayoutDashboard,
  Map,
  Search,
  SearchX,
  Settings,
  Satellite,
  TriangleAlert,
} from 'lucide-react'
import { commandPages } from '../../data/navigation'
import { cn } from '../../lib/utils'

const iconMap = {
  LayoutDashboard,
  Map,
  BellRing,
  Satellite,
  FileText,
  Settings,
  Layers,
  Activity,
  TriangleAlert,
}

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return commandPages
    return commandPages.filter((item) =>
      `${item.label} ${item.description} ${item.group}`
        .toLowerCase()
        .includes(term),
    )
  }, [query])

  const groups = useMemo(
    () => [...new Set(filtered.map((item) => item.group))],
    [filtered],
  )

  useEffect(() => {
    if (!open) return undefined
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 30)
    document.body.style.overflow = 'hidden'
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  const selectItem = (item) => {
    if (!item) return
    navigate(item.path, item.state ? { state: item.state } : undefined)
    onClose()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((current) =>
        filtered.length ? (current + 1) % filtered.length : 0,
      )
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((current) =>
        filtered.length
          ? (current - 1 + filtered.length) % filtered.length
          : 0,
      )
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      selectItem(filtered[selectedIndex])
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close command palette"
        className="fixed inset-0 cursor-default bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl animate-scale-in overflow-hidden rounded-lg border border-line bg-panel shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
        <div className="flex h-12 items-center gap-2.5 border-b border-line px-3.5">
          <Search className="h-4 w-4 shrink-0 text-subtle" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, layers and actions…"
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-subtle"
            aria-label="Command palette search"
          />
          <kbd className="kbd">Esc</kbd>
        </div>

        <div className="max-h-[390px] overflow-y-auto p-2">
          {filtered.length ? (
            groups.map((group) => (
              <div key={group} className="mb-1.5 last:mb-0">
                <p className="px-2 pb-1.5 pt-2 text-[9px] font-medium uppercase tracking-[0.12em] text-subtle">
                  {group}
                </p>
                <div className="space-y-0.5">
                  {filtered
                    .filter((item) => item.group === group)
                    .map((item) => {
                      const index = filtered.findIndex(
                        (entry) => entry.id === item.id,
                      )
                      const Icon = iconMap[item.icon] || Layers
                      const selected = index === selectedIndex
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onMouseEnter={() => setSelectedIndex(index)}
                          onClick={() => selectItem(item)}
                          className={cn(
                            'flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition',
                            selected
                              ? 'bg-elevated text-ink'
                              : 'text-muted hover:bg-elevated/60',
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border',
                              selected
                                ? 'border-brand/30 bg-brand/10 text-brand'
                                : 'border-line bg-canvas text-subtle',
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12px] font-medium">
                              {item.label}
                            </span>
                            <span className="block truncate text-[10px] text-subtle">
                              {item.description}
                            </span>
                          </span>
                          {selected ? (
                            <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-subtle" />
                          ) : null}
                        </button>
                      )
                    })}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-elevated">
                <SearchX className="h-4 w-4 text-subtle" />
              </div>
              <p className="mt-3 text-[12px] font-medium text-ink">
                No results found
              </p>
              <p className="mt-1 text-[11px] text-subtle">
                Try a page name, “NDVI” or “alerts”.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line bg-canvas/40 px-3.5 py-2 text-[10px] text-subtle">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              select
            </span>
          </div>
          <span className="font-mono">Region 1 · Ilocos</span>
        </div>
      </div>
    </div>
  )
}
