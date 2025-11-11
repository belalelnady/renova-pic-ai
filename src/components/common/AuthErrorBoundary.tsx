"use client"

import React from 'react'
import { Shield, RefreshCw, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorBoundary } from './ErrorBoundary'
import { useTranslations } from 'next-intl'

interface AuthErrorFallbackProps {
  resetErrorBoundary: () => void
}

function AuthErrorFallback({ resetErrorBoundary }: AuthErrorFallbackProps) {
  const t = useTranslations('errors')

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        <CardTitle className="text-xl font-semibold">
          {t('auth.title', { default: 'Authentication Error' })}
        </CardTitle>
        <CardDescription>
          {t('auth.description', { 
            default: 'There was an issue with your authentication. Please sign in again.' 
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>{t('auth.message', { 
            default: 'Your session may have expired or there was a connection issue. Please try signing in again.' 
          })}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={resetErrorBoundary}
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('auth.actions.retry', { default: 'Try Again' })}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/api/auth/signin'}
            className="flex-1"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {t('auth.actions.signin', { default: 'Sign In' })}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function AuthErrorBoundary({ children, onError }: AuthErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={<AuthErrorFallback resetErrorBoundary={() => window.location.reload()} />}
      onError={onError}
      resetOnPropsChange={true}
    >
      {children}
    </ErrorBoundary>
  )
}