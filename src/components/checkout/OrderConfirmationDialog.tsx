'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react';
import type { Order, OrderItem, ShippingAddress } from '@/types';

interface OrderConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
    orderDate: Date;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
  };
}

export function OrderConfirmationDialog({
  open,
  onClose,
  order,
}: OrderConfirmationDialogProps) {
  const t = useTranslations();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatAddress = (address: ShippingAddress) => {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-600">
            {t('checkout.orderSuccess')}
          </DialogTitle>
          <DialogDescription className="text-lg">
            {t('checkout.orderSuccessDescription', { orderNumber: order.orderNumber })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('orders.orderNumber')}</p>
                    <p className="font-semibold">{order.orderNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('orders.orderDate')}</p>
                    <p className="font-semibold">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t('orders.status')}:</span>
                  <Badge variant="secondary">
                    {t(`orders.statuses.${order.status}`)}
                  </Badge>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t('checkout.total')}</p>
                  <p className="text-xl font-bold">
                    {t('common.currency', { amount: order.totalAmount.toFixed(2) })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">{t('checkout.orderItems')}</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.photoTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.printSize}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {t('cart.quantity')}: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {t('common.currency', { amount: item.price.toFixed(2) })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">{t('checkout.shippingAddress')}</h3>
              </div>
              <div className="text-sm">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground mt-1">
                  {formatAddress(order.shippingAddress)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                {t('checkout.nextSteps')}
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {t('checkout.confirmationEmail')}</li>
                <li>• {t('checkout.processingTime')}</li>
                <li>• {t('checkout.trackingInfo')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button onClick={onClose} className="flex-1">
            {t('checkout.continueShopping')}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open(`/orders/${order.id}`, '_blank')}
            className="flex-1"
          >
            {t('orders.viewDetails')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}