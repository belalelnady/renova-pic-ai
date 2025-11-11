import { redirect } from 'next/navigation'
import { defaultLocale } from '@/lib/locale'

// Redirect to the default locale
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}