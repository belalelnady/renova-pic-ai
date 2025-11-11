import { EditingSettings } from '@/types';

export interface PrintSize {
  id: string;
  name: string;
  dimensions: string;
  basePrice: number;
  description?: string;
}

export const PRINT_SIZES: PrintSize[] = [
  {
    id: '4x6',
    name: '4×6 inches',
    dimensions: '10×15 cm',
    basePrice: 15,
    description: 'Standard photo size'
  },
  {
    id: '5x7',
    name: '5×7 inches', 
    dimensions: '13×18 cm',
    basePrice: 25,
    description: 'Popular portrait size'
  },
  {
    id: '8x10',
    name: '8×10 inches',
    dimensions: '20×25 cm', 
    basePrice: 45,
    description: 'Large display size'
  },
  {
    id: '11x14',
    name: '11×14 inches',
    dimensions: '28×36 cm',
    basePrice: 75,
    description: 'Premium large size'
  }
];

export const PRICING_CONFIG = {
  FRAME_PRICE: 50, // Additional cost for frame
  EXTRA_PRINT_SET_PRICE: 10, // Additional cost per extra print set
  SHIPPING_COST: 20, // Standard shipping cost
  FREE_SHIPPING_THRESHOLD: 200, // Free shipping above this amount
} as const;

export interface PricingBreakdown {
  basePrice: number;
  framePrice: number;
  extraPrintSetsPrice: number;
  subtotal: number;
  shippingCost: number;
  totalPrice: number;
}

/**
 * Calculate the total price for print options
 */
export function calculatePrintPrice(settings: EditingSettings): PricingBreakdown {
  const printSize = PRINT_SIZES.find(size => size.id === settings.size);
  if (!printSize) {
    throw new Error(`Invalid print size: ${settings.size}`);
  }

  const basePrice = printSize.basePrice * settings.quantity;
  
  let framePrice = 0;
  if (settings.addFrame && isPortraitCategory(settings.category)) {
    framePrice = PRICING_CONFIG.FRAME_PRICE;
  }
  
  let extraPrintSetsPrice = 0;
  if (settings.extraPrintSets && settings.extraPrintSets > 0 && isIdPhotoCategory(settings.category)) {
    extraPrintSetsPrice = settings.extraPrintSets * PRICING_CONFIG.EXTRA_PRINT_SET_PRICE;
  }
  
  const subtotal = basePrice + framePrice + extraPrintSetsPrice;
  const shippingCost = subtotal >= PRICING_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : PRICING_CONFIG.SHIPPING_COST;
  const totalPrice = subtotal + shippingCost;

  return {
    basePrice,
    framePrice,
    extraPrintSetsPrice,
    subtotal,
    shippingCost,
    totalPrice
  };
}

/**
 * Get the photo category from AI tool name
 */
export function getPhotoCategoryFromTool(aiTool: string): EditingSettings['category'] {
  switch (aiTool) {
    case 'visa-photo':
      return 'visa';
    case 'absher':
      return 'absher';
    case 'saudi-look':
      return 'saudi-look';
    case 'baby-photo':
      return 'baby';
    default:
      return 'visa';
  }
}

/**
 * Check if photo category supports frame options
 */
export function isPortraitCategory(category: EditingSettings['category']): boolean {
  return ['saudi-look', 'baby'].includes(category);
}

/**
 * Check if photo category supports extra print sets
 */
export function isIdPhotoCategory(category: EditingSettings['category']): boolean {
  return ['visa', 'absher'].includes(category);
}

/**
 * Get available print sizes for a category
 */
export function getAvailablePrintSizes(category: EditingSettings['category']): PrintSize[] {
  // For ID photos, limit to smaller sizes
  if (isIdPhotoCategory(category)) {
    return PRINT_SIZES.filter(size => ['4x6', '5x7'].includes(size.id));
  }
  
  // For portraits, all sizes are available
  return PRINT_SIZES;
}

/**
 * Validate editing settings
 */
export function validateEditingSettings(settings: EditingSettings): string[] {
  const errors: string[] = [];
  
  // Validate print size
  const availableSizes = getAvailablePrintSizes(settings.category);
  if (!availableSizes.find(size => size.id === settings.size)) {
    errors.push(`Invalid print size "${settings.size}" for category "${settings.category}"`);
  }
  
  // Validate quantity
  if (settings.quantity < 1 || settings.quantity > 10) {
    errors.push('Quantity must be between 1 and 10');
  }
  
  // Validate frame option
  if (settings.addFrame && !isPortraitCategory(settings.category)) {
    errors.push(`Frame option is not available for category "${settings.category}"`);
  }
  
  // Validate extra print sets
  if (settings.extraPrintSets && settings.extraPrintSets > 0 && !isIdPhotoCategory(settings.category)) {
    errors.push(`Extra print sets are not available for category "${settings.category}"`);
  }
  
  if (settings.extraPrintSets && (settings.extraPrintSets < 0 || settings.extraPrintSets > 5)) {
    errors.push('Extra print sets must be between 0 and 5');
  }
  
  return errors;
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'SAR'): string {
  return `${price.toFixed(0)} ${currency}`;
}

/**
 * Get default editing settings for a category
 */
export function getDefaultEditingSettings(category: EditingSettings['category']): EditingSettings {
  const availableSizes = getAvailablePrintSizes(category);
  const defaultSize = availableSizes[0]?.id || '4x6';
  
  return {
    category,
    size: defaultSize,
    quantity: 1,
    addFrame: false,
    extraPrintSets: 0
  };
}