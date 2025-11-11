'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const t = useTranslations()

  const beforeAfterExamples = [
    {
      id: "visa-photo",
      before: "https://base44.app/api/apps/690011e6637df3b25a370af7/files/public/690011e6637df3b25a370af7/696468c25_SuadiGirlStock.jpg",
      after: "https://base44.app/api/apps/690011e6637df3b25a370af7/files/public/690011e6637df3b25a370af7/ef04c34c9_edited-1762135507325.png",
      title: t('photo.visaPhoto') || 'Visa Photo Ready'
    },
    {
      id: "absher-photo",
      before: "https://base44.app/api/apps/690011e6637df3b25a370af7/files/public/690011e6637df3b25a370af7/7bdf0723b_cb29c697-363d-4425-8d5d-b962778da4de.jpg",
      after: "https://base44.app/api/apps/690011e6637df3b25a370af7/files/public/690011e6637df3b25a370af7/802c4bf66_edited-1762293811459.png",
      title: t('photo.absherPhoto') || 'Absher Photo'
    },
    {
      id: "saudi-look",
      before: "https://base44.app/api/apps/690011e6637df3b25a370af7/files/public/690011e6637df3b25a370af7/5b2b3e3d3_wmremove-transformed.jpeg",
      after: "https://base44.app/api/apps/690011e6637df3b25a370af7/files/public/690011e6637df3b25a370af7/7612d4414_edited-1762283151951.png",
      title: t('photo.saudiLook') || 'Saudi Look'
    },
    {
      id: "baby-photo",
      before: "https://base44.app/api/apps/690011e6637df3b25a370af7/files/public/690011e6637df3b25a370af7/d52860589_SuadiGirlStock2.jpg",
      after: "https://base44.app/api/apps/690011e6637df3b25a370af7/files/public/690011e6637df3b25a370af7/df0edddc2_edited-1762134073577.png",
      title: t('photo.babyPhoto') || 'Baby Photo'
    }
  ];

  const process = [
    { step: "01", title: "Upload Your Photo", desc: "Any format, any quality" },
    { step: "02", title: "Choose AI Style", desc: "Visa, portrait, or enhance" },
    { step: "03", title: "Order Prints", desc: "Professional quality" }
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>Trusted by 1,137+ users</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-black leading-[1.1] mb-6">
                AI Photo Editing.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Print Ready.
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                Professional visa photos in 60 seconds. AI-enhanced portraits delivered to your door. No studio, no hassle.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/edit-photo">
                  <Button size="lg" className="bg-black hover:bg-gray-900 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all group">
                    Start Editing
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">Professional quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">60-second editing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">Global shipping</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl rotate-6 opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl -rotate-6 opacity-20"></div>
                
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden p-4">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop"
                    alt="AI Enhanced Portrait"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute top-8 right-8 bg-white rounded-2xl shadow-xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-sm">AI Processing</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before/After Examples */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-black mb-4">
              See The Difference
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real transformations from real customers. No filters, no tricks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beforeAfterExamples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/edit-photo?tool=${example.id}`}>
                  <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl smooth-transition">
                    <div className="grid grid-cols-2">
                      <div className="relative">
                        <img src={example.before} alt="Before" className="w-full h-64 object-cover" />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">Before</div>
                      </div>
                      <div className="relative">
                        <img src={example.after} alt="After" className="w-full h-64 object-cover" />
                        <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">After</div>
                      </div>
                    </div>
                    <div className="p-5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 smooth-transition min-h-[70px] flex items-center justify-center">
                      <h3 className="font-bold text-white text-center text-base sm:text-lg flex items-center justify-center gap-2">
                        {example.title}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 smooth-transition" />
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-black mb-4">
              Three Steps. That&apos;s It.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No complicated software. No learning curve.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {process.map((item, index) => (
              <Link key={index} href="/edit-photo">
                <motion.div
                  initial={{ 
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{ 
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.15,
                    ease: "easeOut"
                  }}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  className="relative group cursor-pointer"
                >
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />

                    <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 h-full transform-gpu transition-all duration-300 group-hover:shadow-2xl">
                      <div className="absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform-gpu group-hover:scale-105 transition-transform duration-300">
                        <span className="text-2xl sm:text-3xl font-black text-white">
                          {item.step}
                        </span>
                      </div>

                      <div className="relative z-10 pt-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-6 mx-auto transform-gpu group-hover:scale-110 transition-transform duration-300">
                          {index === 0 && (
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          )}
                          {index === 1 && (
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          )}
                          {index === 2 && (
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          )}
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4 text-center">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-center text-lg leading-relaxed">
                          {item.desc}
                        </p>

                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                          className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-6 origin-left"
                          style={{ willChange: 'transform' }}
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 rounded-3xl transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
            className="text-center mt-20"
          >
            <Link href="/edit-photo">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-full px-12 py-6 text-xl font-bold shadow-2xl relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Try It Now
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Your Perfect Photo. Seconds Away.
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join 1,137+ users who&apos;ve transformed their photos with AI
            </p>
            <Link href="/edit-photo">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full px-10 py-7 text-xl font-bold shadow-2xl">
                Start Editing
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}