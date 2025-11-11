'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/types';

interface CartSummaryProps {
  items: CartItem[];
  onCheckout?: () => void;
  isCheckingOut?: boolean;
}

export function CartSummary({ items, onCheckout, isCheckingOut = false }: CartSummaryProps) {
  const t = useTranslations();

  const subtotal = items.reduce((total, item) => total + Number(item.totalPrice), 0);
  const shipping = subtotal > 0 ? 10.00 : 0; // Fixed shipping cost, could be dynamic
  const total = subtotal + shipping;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t('checkout.orderSummary')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Item Count */}
        <div className="flex justify-between text-sm">
          <span>
            {itemCount} {itemCount === 1 ? t('cart.item') : t('cart.items')}
          </span>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('cart.subtotal')}:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>{t('cart.shipping')}:</span>
            <span>
              {shipping > 0 ? `$${shipping.toFixed(2)}` : t('common.free')}
            </span>
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between font-medium">
              <span>{t('cart.total')}:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        {onCheckout && (
          <Button
            onClick={onCheckout}
            disabled={items.length === 0 || isCheckingOut}
            className="w-full"
            size="lg"
          >
            {isCheckingOut ? t('common.loading') : t('cart.checkout')}
          </Button>
        )}

        {/* Empty Cart Message */}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t('cart.emptyDescription')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}