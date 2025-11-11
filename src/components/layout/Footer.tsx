import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Mail, Phone } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Photo Editor</h3>
            <p className="text-sm text-gray-600 text-start">
              Professional AI-powered photo editing and printing service. 
              Transform your photos with cutting-edge technology.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider text-start">
              {t('product')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/edit-photo" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  Visa Photo
                </Link>
              </li>
              <li>
                <Link href="/edit-photo" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  Absher Photo
                </Link>
              </li>
              <li>
                <Link href="/edit-photo" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  Saudi Look
                </Link>
              </li>
              <li>
                <Link href="/edit-photo" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  Baby Photo
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  Photo Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider text-start">
              {t('support')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  {t('helpCenter')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider text-start">
              {t('legal')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  {t('returnsPolicy')}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block text-start">
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
            <div className="space-y-2 pt-2">
              <div className="flex items-center text-sm text-gray-600 rtl:flex-row-reverse">
                <Mail className="h-4 w-4 me-2" />
                support@aiphotoeditor.com
              </div>
              <div className="flex items-center text-sm text-gray-600 rtl:flex-row-reverse">
                <Phone className="h-4 w-4 me-2" />
                +1 (555) 123-4567
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center rtl:md:flex-row-reverse">
            <div className="text-sm text-gray-600 text-start">
              © 2024 AI Photo Editor. All rights reserved.
            </div>
            <div className="flex space-x-6 rtl:space-x-reverse mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link href="/returns" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {t('returnsPolicy')}
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {t('termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}