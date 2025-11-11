'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const t = useTranslations();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const imageUrl = item.photo?.editedUrl || item.photo?.thumbnailUrl || item.photo?.originalUrl || item.photoUrl;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Photo Thumbnail */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={item.photoTitle}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate mb-1">
              {item.photoTitle}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              {t('print.size')}: {item.printSize}
            </p>
            <p className="text-sm font-medium">
              ${Number(item.pricePerItem).toFixed(2)} {t('common.each')}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="w-8 text-center text-sm font-medium">
                {item.quantity}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-destructive hover:text-destructive h-8 px-2"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {t('common.remove')}
            </Button>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t">
          <span className="text-sm text-muted-foreground">
            {t('cart.total')}:
          </span>
          <span className="font-medium">
            ${Number(item.totalPrice).toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}