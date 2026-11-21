import { useCallback, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ToastContext } from './toastContext'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (message, options = {}) => {
      counter.current += 1
      const id = counter.current
      setToasts((current) => [
        ...current.slice(-2),
        {
          id,
          message,
          tone: options.tone || 'success',
          description: options.description,
        },
      ])
      window.setTimeout(() => remove(id), 3600)
      return id
    },
    [remove],
  )

  const value = useMemo(() => ({ push, remove }), [push, remove])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex animate-slide-in items-start gap-3 rounded-lg border border-line bg-panel px-3.5 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
          >
            <div
              className={cn(
                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                toast.tone === 'error'
                  ? 'bg-health-deforested/10 text-health-deforested'
                  : 'bg-brand/10 text-brand',
              )}
            >
              {toast.tone === 'error' ? (
                <Info className="h-3.5 w-3.5" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium leading-5 text-ink">
                {toast.message}
              </p>
              {toast.description ? (
                <p className="mt-0.5 text-[11px] leading-4 text-muted">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => remove(toast.id)}
              className="text-subtle transition hover:text-ink"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
