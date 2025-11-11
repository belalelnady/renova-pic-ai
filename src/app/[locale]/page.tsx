import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ImageIcon, Sparkles, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          AI Photo Editor
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform your photos with cutting-edge AI technology. 
          Professional editing tools for visa photos, portraits, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/edit-photo">
            <Button size="lg" className="gap-2">
              <ImageIcon className="h-5 w-5" />
              {t('navigation.editPhoto')}
            </Button>
          </Link>
          <Link href="/gallery">
            <Button variant="outline" size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              {t('navigation.gallery')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
            <p className="text-gray-600">
              Get your edited photos in seconds with our advanced AI algorithms.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your photos are processed securely and never stored permanently.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Quality</h3>
            <p className="text-gray-600">
              Get professional-grade results suitable for official documents.
            </p>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-12 bg-gray-50 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI Editing Tools
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our specialized AI tools designed for different photo types and requirements.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">{t('photo.visaPhoto')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Perfect for passport and visa applications
            </p>
            <Link href="/edit-photo?tool=visa">
              <Button variant="outline" size="sm" className="w-full">
                Try Now
              </Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">{t('photo.absherPhoto')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Optimized for Absher platform requirements
            </p>
            <Link href="/edit-photo?tool=absher">
              <Button variant="outline" size="sm" className="w-full">
                Try Now
              </Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">{t('photo.saudiLook')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Traditional Saudi styling and enhancement
            </p>
            <Link href="/edit-photo?tool=saudi-look">
              <Button variant="outline" size="sm" className="w-full">
                Try Now
              </Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">{t('photo.babyPhoto')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Gentle enhancement for baby portraits
            </p>
            <Link href="/edit-photo?tool=baby">
              <Button variant="outline" size="sm" className="w-full">
                Try Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}