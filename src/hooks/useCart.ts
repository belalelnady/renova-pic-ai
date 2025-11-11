import { useState, useEffect } from 'react';
import { CartItem } from '@/types';

interface UseCartReturn {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (photoId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => void;
  cartCount: number;
  cartTotal: number;
}

export function useCart(): UseCartReturn {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/cart');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch cart');
      }

      setCartItems(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (photoId: string, quantity: number = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoId, quantity }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add to cart');
      }

      // Refetch cart to get updated data
      await fetchCart();
    } catch (err) {
      throw err;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to remove from cart');
      }

      // Refetch cart to get updated data
      await fetchCart();
    } catch (err) {
      throw err;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update quantity');
      }

      // Refetch cart to get updated data
      await fetchCart();
    } catch (err) {
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to clear cart');
      }

      setCartItems([]);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + Number(item.totalPrice), 0);

  return {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refetch: fetchCart,
    cartCount,
    cartTotal
  };
}