"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export function useCSRFToken() {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  const fetchToken = useCallback(async () => {
    if (!session) {
      setToken(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/csrf-token')
      
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token')
      }

      const data = await response.json()
      setToken(data.csrfToken)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  const refreshToken = useCallback(() => {
    fetchToken()
  }, [fetchToken])

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['X-CSRF-Token'] = token
    }

    return headers
  }, [token])

  return {
    token,
    isLoading,
    error,
    refreshToken,
    getHeaders
  }
}