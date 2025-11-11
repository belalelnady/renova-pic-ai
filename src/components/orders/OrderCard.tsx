'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, Calendar, Truck, Eye } from 'lucide-react';
import Link from 'next/link';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const t = useTranslations();

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const itemCount = Array.isArray(order.items) ? order.items.length : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Order Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg">
                  {t('orders.orderNumber')} {order.orderNumber}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(order.orderDate)}
                  </div>
                  <span>•</span>
                  <span>
                    {itemCount} {itemCount === 1 ? t('cart.item') : t('cart.items')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Price */}
          <div className="text-right">
            <Badge className={getStatusColor(order.status)}>
              {t(`orders.statuses.${order.status}`)}
            </Badge>
            <p className="text-lg font-bold mt-2">
              {t('common.currency', { amount: order.totalAmount.toFixed(2) })}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Order Items Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            {t('checkout.orderItems')}
          </h4>
          <div className="space-y-1">
            {Array.isArray(order.items) && order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1 mr-2">{item.photoTitle}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.printSize}
                  </Badge>
                  <span className="text-muted-foreground">×{item.quantity}</span>
                </div>
              </div>
            ))}
            {Array.isArray(order.items) && order.items.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{order.items.length - 3} {t('orders.moreItems')}
              </p>
            )}
          </div>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && (
          <div className="mb-4 p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('orders.trackingNumber')}</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {order.trackingNumber}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/orders/${order.id}`} className="flex-1">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('orders.viewDetails')}
            </Button>
          </Link>
          
          {order.trackingNumber && (
            <Button
              variant="outline"
              onClick={() => {
                // Open tracking URL in new tab
                // This would typically be a carrier-specific URL
                window.open(`https://track.example.com/${order.trackingNumber}`, '_blank');
              }}
              className="flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              {t('orders.trackOrder')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}