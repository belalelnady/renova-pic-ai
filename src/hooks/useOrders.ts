'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Order } from '@/types';

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface UseOrdersOptions {
  page?: number;
  limit?: number;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { page = 1, limit = 10 } = options;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<OrdersResponse>({
    queryKey: ['orders', page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/orders?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      return response.json();
    },
  });

  return {
    orders: data?.orders || [],
    pagination: data?.pagination,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}

export function useOrder(orderId: string) {
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to fetch order');
      }
      
      return response.json();
    },
    enabled: !!orderId,
  });

  return {
    order,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}