import { toast } from '@/hooks/use-toast'

export interface ToastOptions {
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const toastUtils = {
  success: (options: ToastOptions) => {
    toast({
      title: options.title,
      description: options.description,
      duration: options.duration || 5000,
      variant: 'default'
    })
  },

  error: (options: ToastOptions) => {
    toast({
      title: options.title,
      description: options.description,
      duration: options.duration || 7000,
      variant: 'destructive'
    })
  },

  warning: (options: ToastOptions) => {
    toast({
      title: options.title,
      description: options.description,
      duration: options.duration || 6000,
      variant: 'default'
    })
  },

  info: (options: ToastOptions) => {
    toast({
      title: options.title,
      description: options.description,
      duration: options.duration || 4000,
      variant: 'default'
    })
  },

  // Specific toast messages for common scenarios
  photoUploadSuccess: (photoName?: string) => {
    toastUtils.success({
      title: 'Photo uploaded successfully',
      description: photoName ? `${photoName} is ready for editing` : 'Your photo is ready for editing'
    })
  },

  photoProcessingStarted: () => {
    toastUtils.info({
      title: 'Processing photo',
      description: 'AI is working on your photo. This may take a few moments.'
    })
  },

  photoProcessingComplete: () => {
    toastUtils.success({
      title: 'Photo processing complete',
      description: 'Your edited photo is ready!'
    })
  },

  photoProcessingFailed: (retryAction?: () => void) => {
    toastUtils.error({
      title: 'Photo processing failed',
      description: 'There was an issue processing your photo. Please try again.'
    })
  },

  addedToCart: (itemName?: string) => {
    toastUtils.success({
      title: 'Added to cart',
      description: itemName ? `${itemName} has been added to your cart` : 'Item added to your cart'
    })
  },

  removedFromCart: (itemName?: string) => {
    toastUtils.info({
      title: 'Removed from cart',
      description: itemName ? `${itemName} has been removed from your cart` : 'Item removed from your cart'
    })
  },

  orderPlaced: (orderNumber?: string) => {
    toastUtils.success({
      title: 'Order placed successfully',
      description: orderNumber ? `Order #${orderNumber} has been confirmed` : 'Your order has been confirmed',
      duration: 8000
    })
  },

  authenticationRequired: (signInAction?: () => void) => {
    toastUtils.warning({
      title: 'Authentication required',
      description: 'Please sign in to continue'
    })
  },

  networkError: (retryAction?: () => void) => {
    toastUtils.error({
      title: 'Connection error',
      description: 'Please check your internet connection and try again.'
    })
  },

  validationError: (message: string) => {
    toastUtils.error({
      title: 'Validation error',
      description: message
    })
  },

  fileUploadError: (reason?: string) => {
    toastUtils.error({
      title: 'File upload failed',
      description: reason || 'Please check the file format and size, then try again.'
    })
  }
}

// Hook for using toast utilities in components
export function useToastUtils() {
  return toastUtils
}