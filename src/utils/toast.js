import { useToast } from 'vue-toastification'

const toast = useToast()

// Success toast
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    timeout: 3000,
    ...options
  })
}

// Error toast
export const showError = (message, options = {}) => {
  return toast.error(message, {
    timeout: 5000,
    ...options
  })
}

// Warning toast
export const showWarning = (message, options = {}) => {
  return toast.warning(message, {
    timeout: 4000,
    ...options
  })
}

// Info toast
export const showInfo = (message, options = {}) => {
  return toast.info(message, {
    timeout: 3000,
    ...options
  })
}

// Custom toast
export const showToast = (message, type = 'default', options = {}) => {
  return toast(message, {
    type,
    timeout: 3000,
    ...options
  })
}

// Confirm dialog
export const showConfirm = (message, options = {}) => {
  return toast.warning(message, {
    timeout: false,
    closeOnClick: false,
    closeButton: true,
    ...options
  })
}

// Loading toast
export const showLoading = (message = 'กำลังโหลด...', options = {}) => {
  return toast.info(message, {
    timeout: false,
    closeOnClick: false,
    closeButton: false,
    ...options
  })
}

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId)
}

// Clear all toasts
export const clearAllToasts = () => {
  toast.clear()
}

export default toast 