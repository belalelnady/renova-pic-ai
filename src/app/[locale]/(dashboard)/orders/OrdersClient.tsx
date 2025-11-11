'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useOrders } from '@/hooks/useOrders';
import { OrderCard } from '@/components/orders/OrderCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function OrdersClient() {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const { orders, pagination, loading, error, refetch } = useOrders({
    page: currentPage,
    limit: 10,
  });

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
        <Button onClick={() => refetch()}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">{t('orders.empty')}</h2>
        <p className="text-muted-foreground mb-6">{t('orders.emptyDescription')}</p>
        <Link href="/gallery">
          <Button>
            {t('navigation.gallery')}
          </Button>
        </Link>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{t('orders.title')}</h1>
        <p className="text-muted-foreground">
          {pagination && (
            <>
              {t('orders.showingResults', {
                start: (pagination.page - 1) * pagination.limit + 1,
                end: Math.min(pagination.page * pagination.limit, pagination.total),
                total: pagination.total,
              })}
            </>
          )}
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4 mb-8">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('common.previous')}
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.pages}
                className="flex items-center gap-2"
              >
                {t('common.next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}