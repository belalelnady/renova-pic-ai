"use client"

import React from 'react'
import { Camera, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorBoundary } from './ErrorBoundary'
import { useTranslations } from 'next-intl'

interface PhotoErrorFallbackProps {
  resetErrorBoundary: () => void
}

function PhotoErrorFallback({ resetErrorBoundary }: PhotoErrorFallbackProps) {
  const t = useTranslations('errors')

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Camera className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-semibold">
          {t('photo.title', { default: 'Photo Processing Error' })}
        </CardTitle>
        <CardDescription>
          {t('photo.description', { 
            default: 'There was an issue processing your photo. This could be due to file format, size, or a temporary service issue.' 
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 space-y-2">
          <p>{t('photo.suggestions.title', { default: 'Please try:' })}</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>{t('photo.suggestions.format', { default: 'Using a different image format (JPG, PNG)' })}</li>
            <li>{t('photo.suggestions.size', { default: 'Reducing the file size (under 10MB)' })}</li>
            <li>{t('photo.suggestions.quality', { default: 'Ensuring the image is clear and well-lit' })}</li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={resetErrorBoundary}
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('photo.actions.retry', { default: 'Try Again' })}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/edit-photo'}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            {t('photo.actions.newPhoto', { default: 'Upload New Photo' })}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface PhotoErrorBoundaryProps {
  children: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function PhotoErrorBoundary({ children, onError }: PhotoErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={<PhotoErrorFallback resetErrorBoundary={() => window.location.reload()} />}
      onError={onError}
      resetOnPropsChange={true}
    >
      {children}
    </ErrorBoundary>
  )
}