import { useTranslations } from 'next-intl'
import { Mail, Phone, Clock, MapPin } from 'lucide-react'

export default function ReturnsPage() {
  const t = useTranslations('pages.returns')
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-gray max-w-none rtl:prose-rtl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-600">
            {t('lastUpdated')}: November 11, 2024
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('introduction')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('introductionContent')}
          </p>
        </section>

        {/* Return Eligibility */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('eligibility')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('eligibilityContent')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('qualityIssues')}
              </h3>
              <p className="text-gray-700">
                {t('qualityIssuesContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('damagedItems')}
              </h3>
              <p className="text-gray-700">
                {t('damagedItemsContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('wrongOrder')}
              </h3>
              <p className="text-gray-700">
                {t('wrongOrderContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('timeLimit')}
              </h3>
              <p className="text-gray-700">
                {t('timeLimitContent')}
              </p>
            </div>
          </div>
        </section>

        {/* Non-Eligible Returns */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('nonEligible')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('nonEligibleContent')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('customOrders')}
              </h3>
              <p className="text-gray-700">
                {t('customOrdersContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('personalPhotos')}
              </h3>
              <p className="text-gray-700">
                {t('personalPhotosContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('digitalProducts')}
              </h3>
              <p className="text-gray-700">
                {t('digitalProductsContent')}
              </p>
            </div>
          </div>
        </section>

        {/* Return Process */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('process')}
          </h2>
          <p className="text-gray-700 mb-6">
            {t('processContent')}
          </p>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                {t('step1')}
              </h3>
              <p className="text-blue-800">
                {t('step1Content')}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                {t('step2')}
              </h3>
              <p className="text-blue-800">
                {t('step2Content')}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                {t('step3')}
              </h3>
              <p className="text-blue-800">
                {t('step3Content')}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                {t('step4')}
              </h3>
              <p className="text-blue-800">
                {t('step4Content')}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                {t('step5')}
              </h3>
              <p className="text-blue-800">
                {t('step5Content')}
              </p>
            </div>
          </div>
        </section>

        {/* Return Shipping */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('shipping')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('shippingContent')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('ourFault')}
              </h3>
              <p className="text-gray-700">
                {t('ourFaultContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('customerFault')}
              </h3>
              <p className="text-gray-700">
                {t('customerFaultContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('shippingMethod')}
              </h3>
              <p className="text-gray-700">
                {t('shippingMethodContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('shippingTime')}
              </h3>
              <p className="text-gray-700">
                {t('shippingTimeContent')}
              </p>
            </div>
          </div>
        </section>

        {/* Refunds */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('refunds')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('refundsContent')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('refundMethod')}
              </h3>
              <p className="text-gray-700">
                {t('refundMethodContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('refundTime')}
              </h3>
              <p className="text-gray-700">
                {t('refundTimeContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('refundAmount')}
              </h3>
              <p className="text-gray-700">
                {t('refundAmountContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('partialRefunds')}
              </h3>
              <p className="text-gray-700">
                {t('partialRefundsContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('replacements')}
              </h3>
              <p className="text-gray-700">
                {t('replacementsContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('exchanges')}
              </h3>
              <p className="text-gray-700">
                {t('exchangesContent')}
              </p>
            </div>
          </div>
        </section>

        {/* Order Cancellations */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('cancellations')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('cancellationsContent')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('cancellationTime')}
              </h3>
              <p className="text-gray-700">
                {t('cancellationTimeContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('cancellationRefund')}
              </h3>
              <p className="text-gray-700">
                {t('cancellationRefundContent')}
              </p>
            </div>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('disputeResolution')}
          </h2>
          <p className="text-gray-700">
            {t('disputeResolutionContent')}
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('contactInfo')}
          </h2>
          <p className="text-gray-700 mb-6">
            {t('contactInfoContent')}
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="flex items-center text-gray-700 rtl:flex-row-reverse">
              <Mail className="h-5 w-5 me-3 text-gray-500" />
              <div>
                <span className="font-medium">{t('email')}:</span>
                <span className="ms-2">returns@aiphotoeditor.com</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700 rtl:flex-row-reverse">
              <Phone className="h-5 w-5 me-3 text-gray-500" />
              <div>
                <span className="font-medium">{t('phone')}:</span>
                <span className="ms-2">+1 (555) 123-4567</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700 rtl:flex-row-reverse">
              <Clock className="h-5 w-5 me-3 text-gray-500" />
              <div>
                <span className="font-medium">{t('hours')}:</span>
                <span className="ms-2">{t('hoursContent')}</span>
              </div>
            </div>
            
            <div className="flex items-start text-gray-700 rtl:flex-row-reverse">
              <MapPin className="h-5 w-5 me-3 mt-0.5 text-gray-500" />
              <div>
                <span className="font-medium">{t('address')}:</span>
                <div className="ms-2 mt-1">
                  {t('addressContent')}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}