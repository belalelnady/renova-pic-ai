'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartClient() {
  const t = useTranslations();
  const router = useRouter();
  const { toast } = useToast();
  const {
    cartItems,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    cartCount,
    cartTotal
  } = useCart();

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateQuantity(itemId, quantity);
      toast({
        title: t('cart.itemUpdated'),
        description: t('cart.itemUpdated'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('cart.addError'),
        variant: 'destructive',
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast({
        title: t('cart.itemRemoved'),
        description: t('cart.itemRemoved'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('cart.addError'),
        variant: 'destructive',
      });
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('cart.empty')}</h2>
        <p className="text-muted-foreground mb-6">{t('cart.emptyDescription')}</p>
        <Link href="/gallery">
          <Button>
            {t('navigation.gallery')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {cartCount} {cartCount === 1 ? t('cart.item') : t('cart.items')}
          </h2>
        </div>
        
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
          />
        ))}
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <CartSummary
            items={cartItems}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}