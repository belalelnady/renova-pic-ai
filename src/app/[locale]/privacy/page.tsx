import { useTranslations } from 'next-intl'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function PrivacyPage() {
  const t = useTranslations('pages.privacy')
  
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

        {/* Data Collection */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('dataCollection')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('dataCollectionContent')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('personalInfo')}
              </h3>
              <p className="text-gray-700">
                {t('personalInfoContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('photoData')}
              </h3>
              <p className="text-gray-700">
                {t('photoDataContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('usageData')}
              </h3>
              <p className="text-gray-700">
                {t('usageDataContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('orderInfo')}
              </h3>
              <p className="text-gray-700">
                {t('orderInfoContent')}
              </p>
            </div>
          </div>
        </section>

        {/* Data Usage */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('dataUsage')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('dataUsageContent')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('serviceProvision')}
              </h3>
              <p className="text-gray-700">
                {t('serviceProvisionContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('accountManagement')}
              </h3>
              <p className="text-gray-700">
                {t('accountManagementContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('communication')}
              </h3>
              <p className="text-gray-700">
                {t('communicationContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('improvement')}
              </h3>
              <p className="text-gray-700">
                {t('improvementContent')}
              </p>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('dataSecurity')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('dataSecurityContent')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('encryption')}
              </h3>
              <p className="text-gray-700">
                {t('encryptionContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('accessControl')}
              </h3>
              <p className="text-gray-700">
                {t('accessControlContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('regularAudits')}
              </h3>
              <p className="text-gray-700">
                {t('regularAuditsContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('dataRetention')}
              </h3>
              <p className="text-gray-700">
                {t('dataRetentionContent')}
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('yourRights')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('yourRightsContent')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('accessRight')}
              </h3>
              <p className="text-gray-700">
                {t('accessRightContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('correctionRight')}
              </h3>
              <p className="text-gray-700">
                {t('correctionRightContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('deletionRight')}
              </h3>
              <p className="text-gray-700">
                {t('deletionRightContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('portabilityRight')}
              </h3>
              <p className="text-gray-700">
                {t('portabilityRightContent')}
              </p>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('thirdPartyServices')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('thirdPartyServicesContent')}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('googleAuth')}
              </h3>
              <p className="text-gray-700">
                {t('googleAuthContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('aiProcessing')}
              </h3>
              <p className="text-gray-700">
                {t('aiProcessingContent')}
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('paymentProcessing')}
              </h3>
              <p className="text-gray-700">
                {t('paymentProcessingContent')}
              </p>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('cookies')}
          </h2>
          <p className="text-gray-700">
            {t('cookiesContent')}
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('childrenPrivacy')}
          </h2>
          <p className="text-gray-700">
            {t('childrenPrivacyContent')}
          </p>
        </section>

        {/* Policy Changes */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {t('policyChanges')}
          </h2>
          <p className="text-gray-700">
            {t('policyChangesContent')}
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
                <span className="ms-2">privacy@aiphotoeditor.com</span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700 rtl:flex-row-reverse">
              <Phone className="h-5 w-5 me-3 text-gray-500" />
              <div>
                <span className="font-medium">{t('phone')}:</span>
                <span className="ms-2">+1 (555) 123-4567</span>
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