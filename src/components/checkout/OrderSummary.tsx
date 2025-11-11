'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';
import type { CartItem } from '@/types';
import Image from 'next/image';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  loading?: boolean;
}

export function OrderSummary({ items, total, loading = false }: OrderSummaryProps) {
  const t = useTranslations();

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = 25; // Fixed shipping cost
  const tax = subtotal * 0.15; // 15% tax

  return (
    <Card className={loading ? 'opacity-50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          {t('checkout.orderSummary')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                {item.photo?.thumbnailUrl || item.photo?.editedUrl || item.photo?.originalUrl ? (
                  <Image
                    src={item.photo.thumbnailUrl || item.photo.editedUrl || item.photo.originalUrl}
                    alt={item.photoTitle}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.photoTitle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.printSize}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {t('cart.quantity')}: {item.quantity}
                  </span>
                </div>
              </div>
              
              <div className="text-sm font-medium">
                {t('common.currency', { amount: item.totalPrice.toFixed(2) })}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t('checkout.subtotal')}</span>
            <span>{t('common.currency', { amount: subtotal.toFixed(2) })}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>{t('checkout.shipping')}</span>
            <span>{t('common.currency', { amount: shipping.toFixed(2) })}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>{t('checkout.tax')}</span>
            <span>{t('common.currency', { amount: tax.toFixed(2) })}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-base font-semibold">
          <span>{t('checkout.total')}</span>
          <span>{t('common.currency', { amount: (subtotal + shipping + tax).toFixed(2) })}</span>
        </div>

        {/* Order Info */}
        <div className="mt-6 p-3 bg-muted rounded-md">
          <p className="text-xs text-muted-foreground">
            {t('checkout.orderInfo')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}