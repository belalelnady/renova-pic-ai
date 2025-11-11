import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Instagram, Twitter, Mail } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer');
  const logoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690011e6637df3b25a370af7/c39b6225f_Waleed-logo.png";

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src={logoUrl} 
                alt="Alwaleed Studio" 
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-4 max-w-sm">
              {t('description') || 'Professional AI photo editing and printing. Transform your photos in seconds, delivered to your door.'}
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center smooth-transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center smooth-transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center smooth-transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-white mb-4">{t('product') || 'Product'}</h3>
            <ul className="space-y-2">
              <li><Link href="/edit-photo" className="text-gray-400 hover:text-white smooth-transition">{t('editPhotos') || 'Edit Photos'}</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white smooth-transition">{t('gallery') || 'Gallery'}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-4">{t('support') || 'Support'}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white smooth-transition">{t('helpCenter') || 'Help Center'}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white smooth-transition">{t('contactUs') || 'Contact Us'}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-4">{t('legal') || 'Legal'}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white smooth-transition">
                  {t('privacyPolicy') || 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white smooth-transition">
                  {t('returnsPolicy') || 'Return Policy'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Centered */}
        <div className="pt-8 border-t border-white/10">
          <div className="text-sm text-gray-400 text-center">
            © 2025 Alwaleed Studio AI. {t('allRightsReserved') || 'All rights reserved'}
          </div>
        </div>
      </div>
    </footer>
  );
}