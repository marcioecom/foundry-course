import { motion } from 'framer-motion'
import type { ToastData } from '../../types/raffle'

interface ToastProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

const borderColors: Record<ToastData['type'], string> = {
  success: 'rgba(74, 222, 128, 0.3)',
  error: 'rgba(239, 68, 68, 0.3)',
  info: 'rgba(139, 92, 246, 0.3)',
  pending: 'rgba(234, 179, 8, 0.3)',
}

const textColors: Record<ToastData['type'], string> = {
  success: '#4ade80',
  error: '#ef4444',
  info: '#a78bfa',
  pending: '#eab308',
}

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <motion.div
      layout
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
      onClick={() => onDismiss(toast.id)}
      className="toast-item"
      style={{
        border: `1px solid ${borderColors[toast.type]}`,
        color: textColors[toast.type],
        cursor: 'pointer',
      }}
    >
      <div className="toast-label">event // {toast.title.toLowerCase()}</div>
      {'>'} {toast.message}
    </motion.div>
  )
}
