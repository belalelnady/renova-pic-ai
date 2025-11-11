import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { OrdersClient } from './OrdersClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('orders');
  
  return {
    title: t('title'),
    description: t('emptyDescription'),
  };
}

export default function OrdersPage() {
  return <OrdersClient />;
}