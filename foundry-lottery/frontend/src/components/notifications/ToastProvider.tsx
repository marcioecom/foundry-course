import { createContext, useContext, useCallback, useState, type ReactNode } from 'react'
import type { ToastData } from '../../types/raffle'
import { TOAST_DURATION, MAX_VISIBLE_TOASTS } from '../../lib/constants'

interface ToastContextValue {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
  dismissToast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = `toast-${++toastId}`
      setToasts((prev) => {
        const next = [...prev, { ...toast, id }]
        return next.slice(-MAX_VISIBLE_TOASTS)
      })

      if (toast.type !== 'pending') {
        setTimeout(() => dismissToast(id), TOAST_DURATION)
      }
    },
    [dismissToast],
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  )
}
