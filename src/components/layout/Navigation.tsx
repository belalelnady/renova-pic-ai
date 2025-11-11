'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  ImageIcon, 
  Images, 
  ShoppingCart, 
  Package,
  User
} from 'lucide-react'

const navigationItems = [
  {
    key: 'home',
    href: '/',
    icon: Home,
  },
  {
    key: 'editPhoto',
    href: '/edit-photo',
    icon: ImageIcon,
  },
  {
    key: 'gallery',
    href: '/gallery',
    icon: Images,
  },
  {
    key: 'cart',
    href: '/cart',
    icon: ShoppingCart,
  },
  {
    key: 'orders',
    href: '/orders',
    icon: Package,
  },
  {
    key: 'profile',
    href: '/profile',
    icon: User,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const t = useTranslations('navigation')

  return (
    <nav className="flex items-center space-x-1 rtl:space-x-reverse">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || 
          (item.href !== '/' && pathname.startsWith(item.href))
        
        return (
          <Link key={item.key} href={item.href}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              className="flex items-center gap-2 rtl:flex-row-reverse"
            >
              <Icon className="h-4 w-4" />
              {t(item.key)}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}