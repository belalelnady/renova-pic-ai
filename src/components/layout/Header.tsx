'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Navigation } from './Navigation'
import { UserProfile } from '@/components/auth/UserProfile'
import { CartBadge } from './CartBadge'
import { LanguageToggle } from '@/components/common/LanguageToggle'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, Sparkles, Image, ShoppingCart, User } from 'lucide-react'

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const logoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690011e6637df3b25a370af7/c39b6225f_Waleed-logo.png";

  const navigationItems = [
    { name: t('navigation.home'), path: '/', icon: Home },
    { name: t('navigation.editPhoto'), path: '/edit-photo', icon: Sparkles },
    { name: t('navigation.gallery'), path: '/gallery', icon: Image },
    { name: t('navigation.cart'), path: '/cart', icon: ShoppingCart },
    { name: t('navigation.profile'), path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center hover:opacity-80 smooth-transition">
              <img 
                src={logoUrl} 
                alt="Alwaleed Studio" 
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold smooth-transition ${
                    pathname === item.path
                      ? "text-black bg-gray-100"
                      : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </span>
                </Link>
              ))}
              <LanguageToggle />
            </nav>

            <div className="md:hidden flex items-center gap-2">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold smooth-transition ${
                    pathname === item.path
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      
      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}