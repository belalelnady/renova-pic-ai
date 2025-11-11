'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SignInButton } from './SignInButton'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  fallback,
  redirectTo = '/signin'
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session && redirectTo) {
      router.push(redirectTo)
    }
  }, [session, status, router, redirectTo])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Sign in required
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          You need to be signed in to access this page. Please sign in with your Google account to continue.
        </p>
        <SignInButton />
      </div>
    )
  }

  return <>{children}</>
}