'use client'

import { useSession } from 'next-auth/react'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

export function CartBadge() {
  const { data: session } = useSession()
  const { cartCount } = useCart()

  if (!session) {
    return null
  }

  return (
    <Link href="/cart">
      <Button variant="ghost" size="sm" className="relative">
        <ShoppingCart className="h-4 w-4" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
        <span className="sr-only">Shopping cart with {cartCount} items</span>
      </Button>
    </Link>
  )
}