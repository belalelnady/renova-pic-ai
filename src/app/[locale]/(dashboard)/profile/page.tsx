import { useTranslations } from 'next-intl'

export default function Profile() {
  const t = useTranslations('profile')
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-start">{t('title')}</h1>
      {/* Profile functionality will be implemented in task 9.3 */}
      <div className="text-center py-12">
        <p className="text-gray-600">Profile functionality will be implemented in a future task.</p>
      </div>
    </div>
  );
}