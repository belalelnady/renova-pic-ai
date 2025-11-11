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
  User,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
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

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t shadow-lg md:hidden z-50">
          <nav className="flex flex-col p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href))
              
              return (
                <Link 
                  key={item.key} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start gap-2 rtl:justify-end rtl:flex-row-reverse"
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.key)}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}