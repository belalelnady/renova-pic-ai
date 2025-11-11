'use client';

import { useTranslations } from 'next-intl';
import { useOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MapPin, 
  Truck, 
  Receipt,
  Download,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { ShippingAddress, OrderItem } from '@/types';

interface OrderDetailsClientProps {
  orderId: string;
}

export function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
  const t = useTranslations();
  const { order, loading, error, refetch } = useOrder(orderId);

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
        <div className="space-x-4">
          <Button onClick={() => refetch()}>
            {t('common.retry')}
          </Button>
          <Link href="/orders">
            <Button variant="outline">
              {t('orders.backToOrders')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('orders.notFound')}</h2>
        <p className="text-muted-foreground mb-6">{t('orders.notFoundDescription')}</p>
        <Link href="/orders">
          <Button>
            {t('orders.backToOrders')}
          </Button>
        </Link>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
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

  const subtotal = Array.isArray(order.items) 
    ? order.items.reduce((sum, item) => sum + item.price, 0)
    : 0;
  const shipping = 25;
  const tax = subtotal * 0.15;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('orders.backToOrders')}
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t('orders.orderNumber')} {order.orderNumber}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(order.orderDate)}
              </div>
              <Badge className={getStatusColor(order.status)}>
                {t(`orders.statuses.${order.status}`)}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {t('common.currency', { amount: order.totalAmount.toFixed(2) })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('checkout.orderItems')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(order.items) && order.items.map((item: OrderItem, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                      {item.photoUrl ? (
                        <Image
                          src={item.photoUrl}
                          alt={item.photoTitle}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{item.photoTitle}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.printSize}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {t('cart.quantity')}: {item.quantity}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium">
                        {t('common.currency', { amount: item.price.toFixed(2) })}
                      </p>
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t('checkout.shippingAddress')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground mt-1">
                  {formatAddress(order.shippingAddress)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Tracking */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                {t('checkout.orderSummary')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="flex justify-between font-semibold">
                <span>{t('checkout.total')}</span>
                <span>{t('common.currency', { amount: order.totalAmount.toFixed(2) })}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {t('orders.trackingInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('orders.trackingNumber')}</p>
                    <p className="font-mono text-sm">{order.trackingNumber}</p>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => {
                      window.open(`https://track.example.com/${order.trackingNumber}`, '_blank');
                    }}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    {t('orders.trackOrder')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{t('orders.orderStatus')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="text-sm font-medium">{t('orders.statuses.pending')}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.orderDate)}
                    </p>
                  </div>
                </div>
                
                {order.status !== 'pending' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium">{t('orders.statuses.processing')}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
                
                {['shipped', 'delivered'].includes(order.status) && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium">{t('orders.statuses.shipped')}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
                
                {order.status === 'delivered' && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm font-medium">{t('orders.statuses.delivered')}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}