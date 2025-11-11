"use client"

import { withErrorHandling } from './error-recovery'

interface ApiClientOptions {
  baseUrl?: string
  defaultHeaders?: Record<string, string>
  timeout?: number
  retryAttempts?: number
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
  csrfToken?: string
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private timeout: number
  private retryAttempts: number

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || ''
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.defaultHeaders
    }
    this.timeout = options.timeout || 30000 // 30 seconds
    this.retryAttempts = options.retryAttempts || 3
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const method = options.method || 'GET'
    
    const headers = {
      ...this.defaultHeaders,
      ...options.headers
    }

    // Add CSRF token for state-changing requests
    if (options.csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      headers['X-CSRF-Token'] = options.csrfToken
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'same-origin', // Include cookies for authentication
    }

    // Add body for non-GET requests
    if (options.body && method !== 'GET') {
      if (options.body instanceof FormData) {
        // Remove Content-Type header for FormData (browser will set it with boundary)
        delete headers['Content-Type']
        config.body = options.body
      } else {
        config.body = JSON.stringify(options.body)
      }
    }

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout)
    config.signal = controller.signal

    try {
      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      let data: any

      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        throw new ApiError(
          data.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data
        )
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408)
        }
        throw new ApiError(error.message, 0)
      }

      throw new ApiError('Unknown error occurred', 0)
    }
  }

  async get<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return withErrorHandling(
      () => this.makeRequest<T>(endpoint, { ...options, method: 'GET' }),
      { 
        context: `GET ${endpoint}`,
        retryOptions: {
          retryCount: this.retryAttempts,
          retryDelay: 1000
        }
      }
    ) as Promise<T>
  }

  async post<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return withErrorHandling(
      () => this.makeRequest<T>(endpoint, { ...options, method: 'POST', body }),
      { 
        context: `POST ${endpoint}`,
        retryOptions: {
          retryCount: 1, // Less retries for POST requests
          retryDelay: 1000
        }
      }
    ) as Promise<T>
  }

  async put<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return withErrorHandling(
      () => this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body }),
      { 
        context: `PUT ${endpoint}`,
        retryOptions: {
          retryCount: 1,
          retryDelay: 1000
        }
      }
    ) as Promise<T>
  }

  async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return withErrorHandling(
      () => this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' }),
      { 
        context: `DELETE ${endpoint}`,
        retryOptions: {
          retryCount: 1,
          retryDelay: 1000
        }
      }
    ) as Promise<T>
  }

  async patch<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return withErrorHandling(
      () => this.makeRequest<T>(endpoint, { ...options, method: 'PATCH', body }),
      { 
        context: `PATCH ${endpoint}`,
        retryOptions: {
          retryCount: 1,
          retryDelay: 1000
        }
      }
    ) as Promise<T>
  }

  // Utility method for file uploads
  async uploadFile<T>(
    endpoint: string, 
    file: File, 
    additionalData?: Record<string, any>,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value))
      })
    }

    return this.post<T>(endpoint, formData, options)
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }

  get isServerError(): boolean {
    return this.status >= 500
  }

  get isNetworkError(): boolean {
    return this.status === 0
  }

  get isTimeout(): boolean {
    return this.status === 408
  }
}

// Default API client instance
export const apiClient = new ApiClient()

// Hook for using API client with CSRF token
export function useApiClient() {
  return apiClient
}