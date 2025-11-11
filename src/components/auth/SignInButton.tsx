'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogIn, LogOut, User, Settings, ShoppingBag, Images } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function SignInButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <User className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {session.user?.name || session.user?.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/gallery" className="flex items-center gap-2 cursor-pointer">
              <Images className="h-4 w-4" />
              My Photos
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/cart" className="flex items-center gap-2 cursor-pointer">
              <ShoppingBag className="h-4 w-4" />
              My Cart
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => signIn('google')}
      className="flex items-center gap-2"
    >
      <LogIn className="h-4 w-4" />
      <span className="hidden sm:inline">Sign in with Google</span>
      <span className="sm:hidden">Sign in</span>
    </Button>
  )
}