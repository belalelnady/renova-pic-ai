'use client'

import { useSession } from 'next-auth/react'
import { SignInButton } from './SignInButton'

interface UserProfileProps {
  children?: React.ReactNode
}

export function UserProfile({ children }: UserProfileProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!session) {
    return <SignInButton />
  }

  return (
    <div className="flex items-center gap-4">
      {children}
      <SignInButton />
    </div>
  )
}