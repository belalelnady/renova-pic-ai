"use client"

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md', 
  className,
  fullScreen = false 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex items-center justify-center p-8'

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center space-y-3">
        <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
        <p className={cn('text-gray-600 font-medium', textSizeClasses[size])}>
          {message}
        </p>
      </div>
    </div>
  )
}

// Skeleton loading components for different content types
export function PhotoSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
      <div className="bg-gray-200 h-16 w-16 rounded"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  )
}

export function GallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PhotoSkeleton key={i} />
      ))}
    </div>
  )
}