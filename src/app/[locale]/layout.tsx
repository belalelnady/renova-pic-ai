import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { LanguageProvider } from '@/providers/LanguageProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { isValidLocale, type Locale } from '@/lib/locale'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Photo Editor',
  description: 'Professional AI-powered photo editing and printing service',
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }]
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!isValidLocale(locale)) {
    notFound()
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <LanguageProvider initialLocale={locale as Locale}>
            <AuthProvider>
              <QueryProvider>
                <div className="min-h-screen bg-white">
                  <Header />
                  <main>
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toaster />
              </QueryProvider>
            </AuthProvider>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}