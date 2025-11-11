import { useTranslations } from 'next-intl'
import { CartClient } from './CartClient'

export default function Cart() {
  const t = useTranslations('cart')
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-start">{t('title')}</h1>
      <CartClient />
    </div>
  );
}