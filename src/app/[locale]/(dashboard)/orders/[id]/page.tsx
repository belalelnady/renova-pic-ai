import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { OrderDetailsClient } from './OrderDetailsClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations('orders');
  
  return {
    title: `${t('orderDetails')} - ${params.id}`,
    description: t('orderDetailsDescription'),
  };
}

export default function OrderDetailsPage({ params }: Props) {
  return <OrderDetailsClient orderId={params.id} />;
}