import { AnimatePresence } from 'framer-motion'
import { useToast } from './ToastProvider'
import { Toast } from './Toast'

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="toast-container">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
