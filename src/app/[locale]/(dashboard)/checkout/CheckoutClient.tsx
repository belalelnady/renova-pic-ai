'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { OrderConfirmationDialog } from '@/components/checkout/OrderConfirmationDialog';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { ShippingAddressFormData } from '@/lib/validations';

export function CheckoutClient() {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const { cartItems, cartTotal, loading: cartLoading, refetch: refetchCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const handleCheckoutSubmit = async (shippingData: ShippingAddressFormData) => {
    if (cartItems.length === 0) {
      toast({
        title: t('common.error'),
        description: t('checkout.emptyCart'),
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        shippingAddress: shippingData,
        items: cartItems.map(item => ({
          photoId: item.photoId,
          photoTitle: item.photoTitle,
          photoUrl: item.photoUrl,
          printSize: item.printSize,
          quantity: item.quantity,
          price: item.totalPrice,
        })),
        totalAmount: cartTotal,
      };

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await response.json();

      // Prepare order data for confirmation dialog
      const orderWithDetails = {
        ...order,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
      };

      // Set order data and show confirmation dialog
      setCreatedOrder(orderWithDetails);
      setShowConfirmation(true);

      // Refetch cart to clear it
      await refetchCart();
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : t('checkout.orderError'));
      toast({
        title: t('common.error'),
        description: error instanceof Error ? error.message : t('checkout.orderError'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setCreatedOrder(null);
    router.push('/gallery'); // Redirect to gallery after closing confirmation
  };

  if (cartLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('checkout.emptyCart')}</h2>
        <p className="text-muted-foreground mb-6">{t('checkout.emptyCartDescription')}</p>
        <Link href="/gallery">
          <Button>
            {t('navigation.gallery')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('checkout.backToCart')}
        </Link>
        <h1 className="text-2xl font-bold">{t('checkout.title')}</h1>
        <p className="text-muted-foreground">{t('checkout.description')}</p>
      </div>

      {/* Checkout Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <CheckoutForm
            onSubmit={handleCheckoutSubmit}
            loading={isProcessing}
            error={error || undefined}
          />
        </div>

        {/* Order Summary */}
        <div>
          <div className="sticky top-24">
            <OrderSummary
              items={cartItems}
              total={cartTotal}
              loading={isProcessing}
            />
          </div>
        </div>
      </div>

      {/* Order Confirmation Dialog */}
      {createdOrder && (
        <OrderConfirmationDialog
          open={showConfirmation}
          onClose={handleConfirmationClose}
          order={createdOrder}
        />
      )}
    </div>
  );
}