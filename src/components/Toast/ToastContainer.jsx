import { useToast } from '../../context/ToastContext'
import './Toast.css'

const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          <div className="toast-icon">
            {toast.type === 'success' && '✅'}
            {toast.type === 'error' && '❌'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'info' && 'ℹ️'}
          </div>
          <div className="toast-content">
            <p className="toast-message">{toast.message}</p>
          </div>
          <button
            className="toast-close"
            onClick={(e) => {
              e.stopPropagation()
              removeToast(toast.id)
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer 