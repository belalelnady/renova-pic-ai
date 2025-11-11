import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CheckoutClient } from './CheckoutClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('checkout');
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function CheckoutPage() {
  return <CheckoutClient />;
}