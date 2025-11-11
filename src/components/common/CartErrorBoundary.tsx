"use client"

import React from 'react'
import { ShoppingCart, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorBoundary } from './ErrorBoundary'
import { useTranslations } from 'next-intl'

interface CartErrorFallbackProps {
  resetErrorBoundary: () => void
}

function CartErrorFallback({ resetErrorBoundary }: CartErrorFallbackProps) {
  const t = useTranslations('errors')

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <ShoppingCart className="h-8 w-8 text-orange-600" />
        </div>
        <CardTitle className="text-xl font-semibold">
          {t('cart.title', { default: 'Cart Error' })}
        </CardTitle>
        <CardDescription>
          {t('cart.description', { 
            default: 'There was an issue loading your cart. Your items may still be saved.' 
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>{t('cart.message', { 
            default: 'Don\'t worry - your cart items are usually preserved. Try refreshing the page or navigating back to continue shopping.' 
          })}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={resetErrorBoundary}
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('cart.actions.retry', { default: 'Refresh Cart' })}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/gallery'}
            className="flex-1"
          >
            <Home className="mr-2 h-4 w-4" />
            {t('cart.actions.gallery', { default: 'Back to Gallery' })}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface CartErrorBoundaryProps {
  children: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function CartErrorBoundary({ children, onError }: CartErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={<CartErrorFallback resetErrorBoundary={() => window.location.reload()} />}
      onError={onError}
      resetOnPropsChange={true}
    >
      {children}
    </ErrorBoundary>
  )
}