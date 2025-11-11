import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Navigation } from './Navigation'
import { UserProfile } from '@/components/auth/UserProfile'
import { CartBadge } from './CartBadge'
import { LanguageToggle } from '@/components/common/LanguageToggle'

export default function Header() {
  const t = useTranslations();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            AI Photo Editor
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <Navigation />
            <div className="border-l rtl:border-l-0 rtl:border-r pl-4 rtl:pl-0 rtl:pr-4 flex items-center space-x-2 rtl:space-x-reverse">
              <LanguageToggle />
              <UserProfile>
                <CartBadge />
              </UserProfile>
            </div>
          </div>

          {/* Mobile Navigation and Auth */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <LanguageToggle />
            <CartBadge />
            <UserProfile />
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}