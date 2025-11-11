'use client';

import { useState, useCallback } from 'react';
import { EditingSettings } from '@/types';
import { PricingBreakdown, calculatePrintPrice } from '@/lib/pricing';

interface PhotoPricingState {
  settings: EditingSettings | null;
  pricing: PricingBreakdown | null;
  isLoading: boolean;
  error: string | null;
}

interface UsePhotoPricingReturn {
  state: PhotoPricingState;
  updateSettings: (settings: EditingSettings) => void;
  calculatePricing: (settings: EditingSettings) => Promise<PricingBreakdown>;
  savePricingToPhoto: (photoId: string, settings: EditingSettings) => Promise<boolean>;
  clearState: () => void;
}

export function usePhotoPricing(): UsePhotoPricingReturn {
  const [state, setState] = useState<PhotoPricingState>({
    settings: null,
    pricing: null,
    isLoading: false,
    error: null,
  });

  const updateSettings = useCallback((settings: EditingSettings) => {
    try {
      const pricing = calculatePrintPrice(settings);
      setState({
        settings,
        pricing,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to calculate pricing',
        isLoading: false,
      }));
    }
  }, []);

  const calculatePricing = useCallback(async (settings: EditingSettings): Promise<PricingBreakdown> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/photos/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ editingSettings: settings }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate pricing');
      }

      const data = await response.json();
      const pricing = data.data.pricing;

      setState({
        settings,
        pricing,
        isLoading: false,
        error: null,
      });

      return pricing;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to calculate pricing';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  const savePricingToPhoto = useCallback(async (photoId: string, settings: EditingSettings): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/photos/pricing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoId, editingSettings: settings }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save pricing');
      }

      const data = await response.json();
      const pricing = data.data.pricing;

      setState({
        settings,
        pricing,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save pricing';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      return false;
    }
  }, []);

  const clearState = useCallback(() => {
    setState({
      settings: null,
      pricing: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    state,
    updateSettings,
    calculatePricing,
    savePricingToPhoto,
    clearState,
  };
}