import { toast } from '@/hooks/use-toast'

export interface ErrorRecoveryOptions {
  retryCount?: number
  retryDelay?: number
  onRetry?: () => void
  onMaxRetriesReached?: () => void
  showToast?: boolean
  toastMessage?: string
}

export class ErrorRecoveryManager {
  private retryAttempts = new Map<string, number>()

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationId: string,
    options: ErrorRecoveryOptions = {}
  ): Promise<T> {
    const {
      retryCount = 3,
      retryDelay = 1000,
      onRetry,
      onMaxRetriesReached,
      showToast = true,
      toastMessage
    } = options

    const currentAttempts = this.retryAttempts.get(operationId) || 0

    try {
      const result = await operation()
      // Reset retry count on success
      this.retryAttempts.delete(operationId)
      return result
    } catch (error) {
      const nextAttempts = currentAttempts + 1
      this.retryAttempts.set(operationId, nextAttempts)

      if (nextAttempts < retryCount) {
        if (showToast) {
          toast({
            title: 'Retrying...',
            description: toastMessage || `Attempt ${nextAttempts} of ${retryCount}`,
            variant: 'default'
          })
        }

        onRetry?.()

        // Wait before retrying with exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay * Math.pow(2, nextAttempts - 1))
        )

        return this.executeWithRetry(operation, operationId, options)
      } else {
        // Max retries reached
        this.retryAttempts.delete(operationId)
        
        if (showToast) {
          toast({
            title: 'Operation Failed',
            description: toastMessage || 'Maximum retry attempts reached. Please try again later.',
            variant: 'destructive'
          })
        }

        onMaxRetriesReached?.()
        throw error
      }
    }
  }

  clearRetryCount(operationId: string) {
    this.retryAttempts.delete(operationId)
  }

  getRetryCount(operationId: string): number {
    return this.retryAttempts.get(operationId) || 0
  }
}

// Global instance
export const errorRecovery = new ErrorRecoveryManager()

// Utility functions for common error scenarios
export function handleApiError(error: unknown, context?: string): string {
  console.error(`API Error${context ? ` in ${context}` : ''}:`, error)

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch')) {
      return 'Network connection error. Please check your internet connection.'
    }
    
    // Timeout errors
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.'
    }

    return error.message
  }

  // Handle Response objects
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const response = error as Response
    switch (response.status) {
      case 400:
        return 'Invalid request. Please check your input.'
      case 401:
        return 'Authentication required. Please sign in.'
      case 403:
        return 'Access denied. You don\'t have permission for this action.'
      case 404:
        return 'Resource not found.'
      case 429:
        return 'Too many requests. Please wait a moment and try again.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return `Request failed with status ${response.status}`
    }
  }

  return 'An unexpected error occurred. Please try again.'
}

export function showErrorToast(error: unknown, context?: string) {
  const message = handleApiError(error, context)
  
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive'
  })
}

export function showSuccessToast(message: string, description?: string) {
  toast({
    title: message,
    description,
    variant: 'default'
  })
}

// Async operation wrapper with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options: {
    context?: string
    showToast?: boolean
    retryOptions?: ErrorRecoveryOptions
  } = {}
): Promise<T | null> {
  const { context, showToast = true, retryOptions } = options

  try {
    if (retryOptions) {
      return await errorRecovery.executeWithRetry(
        operation,
        context || 'default',
        { ...retryOptions, showToast }
      )
    } else {
      return await operation()
    }
  } catch (error) {
    if (showToast) {
      showErrorToast(error, context)
    }
    return null
  }
}