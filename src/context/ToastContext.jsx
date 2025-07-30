import { createContext, useContext, useState } from 'react'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'info', 'warning'
      duration
    }

    setToasts(prevToasts => [...prevToasts, toast])

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }

  const showSuccess = (message, duration) => {
    return addToast(message, 'success', duration)
  }

  const showError = (message, duration) => {
    return addToast(message, 'error', duration)
  }

  const showInfo = (message, duration) => {
    return addToast(message, 'info', duration)
  }

  const showWarning = (message, duration) => {
    return addToast(message, 'warning', duration)
  }

  const value = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
} 