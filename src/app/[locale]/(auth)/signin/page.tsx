import { useTranslations } from 'next-intl'
import { SignInButton } from '@/components/auth/SignInButton'

export default function SignIn() {
  const t = useTranslations('auth')
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {t('signInTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('signInDescription')}
          </p>
        </div>
        <div className="flex justify-center">
          <SignInButton />
        </div>
      </div>
    </div>
  );
}