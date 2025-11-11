import { z } from 'zod';

// Common validation patterns
const SAFE_STRING_REGEX = /^[a-zA-Z0-9\s\u0600-\u06FF\-_.,!?()]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;
const URL_REGEX = /^https?:\/\/.+/;

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Input sanitization helper
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
}

// Shipping address validation schema
export const shippingAddressSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, 'Full name can only contain letters and spaces'),
  
  addressLine1: z
    .string()
    .min(5, 'Address line 1 must be at least 5 characters')
    .max(200, 'Address line 1 must be less than 200 characters'),
  
  addressLine2: z
    .string()
    .max(200, 'Address line 2 must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters')
    .regex(/^[a-zA-Z\s\u0600-\u06FF-]+$/, 'City can only contain letters, spaces, and hyphens'),
  
  state: z
    .string()
    .min(2, 'State/Province must be at least 2 characters')
    .max(100, 'State/Province must be less than 100 characters'),
  
  postalCode: z
    .string()
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code must be less than 20 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid postal code format'),
  
  country: z
    .string()
    .min(2, 'Country must be selected')
    .max(100, 'Country name is too long'),
});

// Order creation schema
export const orderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  items: z.array(z.object({
    photoId: z.string(),
    photoTitle: z.string(),
    photoUrl: z.string(),
    printSize: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })).min(1, 'Order must contain at least one item'),
  totalAmount: z.number().min(0),
});

// Photo upload validation schema
export const photoUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 10MB')
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      'File must be a valid image (JPEG, PNG, WEBP)'
    ),
  aiTool: z.enum(['visa-photo', 'absher', 'saudi-look', 'baby-photo'], {
    required_error: 'Please select an AI tool',
  }),
});

// Photo processing schema
export const photoProcessingSchema = z.object({
  photoId: z.string().uuid('Invalid photo ID'),
  aiTool: z.enum(['visa-photo', 'absher', 'saudi-look', 'baby-photo']),
  settings: z.object({
    category: z.enum(['visa', 'absher', 'saudi-look', 'baby']),
    size: z.string().min(1, 'Size is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100'),
    addFrame: z.boolean().optional(),
    extraPrintSets: z.number().min(0).max(10).optional(),
  }),
});

// Cart item validation schema
export const cartItemSchema = z.object({
  photoId: z.string().uuid('Invalid photo ID'),
  photoTitle: z.string().min(1, 'Photo title is required').max(200, 'Title too long'),
  photoUrl: z.string().url('Invalid photo URL'),
  printSize: z.string().min(1, 'Print size is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100'),
  pricePerItem: z.number().min(0, 'Price must be positive'),
  totalPrice: z.number().min(0, 'Total price must be positive'),
});

// User profile validation schema
export const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(SAFE_STRING_REGEX, 'Name contains invalid characters')
    .transform(sanitizeInput),
  email: z
    .string()
    .email('Invalid email address')
    .regex(EMAIL_REGEX, 'Invalid email format')
    .transform(sanitizeInput),
  phone: z
    .string()
    .regex(PHONE_REGEX, 'Invalid phone number format')
    .optional()
    .transform((val) => val ? sanitizeInput(val) : val),
  preferences: z.object({
    language: z.enum(['en', 'ar']),
    notifications: z.boolean().default(true),
  }).optional(),
});

// Search and filter validation schema
export const searchFilterSchema = z.object({
  query: z
    .string()
    .max(100, 'Search query too long')
    .regex(SAFE_STRING_REGEX, 'Search contains invalid characters')
    .transform(sanitizeInput)
    .optional(),
  aiTool: z.enum(['all', 'visa-photo', 'absher', 'saudi-look', 'baby-photo']).optional(),
  sortBy: z.enum(['newest', 'oldest', 'alphabetical']).optional(),
  page: z.number().min(1).max(1000).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(SAFE_STRING_REGEX, 'Name contains invalid characters')
    .transform(sanitizeInput),
  email: z
    .string()
    .email('Invalid email address')
    .regex(EMAIL_REGEX, 'Invalid email format')
    .transform(sanitizeInput),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .regex(SAFE_STRING_REGEX, 'Subject contains invalid characters')
    .transform(sanitizeInput),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .regex(SAFE_STRING_REGEX, 'Message contains invalid characters')
    .transform(sanitizeInput),
});

// API request validation schema
export const apiRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  headers: z.record(z.string()).optional(),
  body: z.any().optional(),
  timestamp: z.number().optional(),
});

// File metadata validation schema
export const fileMetadataSchema = z.object({
  fileName: z
    .string()
    .min(1, 'File name is required')
    .max(255, 'File name too long')
    .regex(/^[a-zA-Z0-9\-_. ]+$/, 'Invalid file name characters'),
  fileSize: z.number().min(1).max(MAX_FILE_SIZE),
  mimeType: z.enum(ALLOWED_IMAGE_TYPES as [string, ...string[]]),
  userId: z.string().uuid('Invalid user ID'),
});

// Webhook payload validation schema
export const webhookPayloadSchema = z.object({
  event: z.string().min(1, 'Event type is required'),
  data: z.record(z.any()),
  timestamp: z.number(),
  signature: z.string().optional(),
});

// Rate limiting schema
export const rateLimitSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  action: z.string().min(1, 'Action is required'),
  timestamp: z.number(),
  count: z.number().min(1),
});

// Type exports
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type PhotoUploadFormData = z.infer<typeof photoUploadSchema>;
export type PhotoProcessingFormData = z.infer<typeof photoProcessingSchema>;
export type CartItemFormData = z.infer<typeof cartItemSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type SearchFilterFormData = z.infer<typeof searchFilterSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ApiRequestData = z.infer<typeof apiRequestSchema>;
export type FileMetadataData = z.infer<typeof fileMetadataSchema>;
export type WebhookPayloadData = z.infer<typeof webhookPayloadSchema>;
export type RateLimitData = z.infer<typeof rateLimitSchema>;

// Country list for validation
export const COUNTRIES = [
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية' },
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين' },
  { code: 'OM', name: 'Oman', nameAr: 'عُمان' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن' },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان' },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر' },
] as const;

// Address formatting utility
export function formatAddress(address: ShippingAddressFormData): string {
  const parts = [
    address.fullName,
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
    COUNTRIES.find(c => c.code === address.country)?.name || address.country
  ].filter(Boolean);
  
  return parts.join(', ');
}

// Postal code validation by country
export function validatePostalCodeForCountry(postalCode: string, countryCode: string): boolean {
  const patterns: Record<string, RegExp> = {
    SA: /^\d{5}(-\d{4})?$/, // Saudi Arabia: 12345 or 12345-1234
    AE: /^\d{5}$/, // UAE: 12345
    KW: /^\d{5}$/, // Kuwait: 12345
    QA: /^\d{4}$/, // Qatar: 1234
    BH: /^\d{3,4}$/, // Bahrain: 123 or 1234
    OM: /^\d{3}$/, // Oman: 123
    JO: /^\d{5}$/, // Jordan: 12345
    LB: /^\d{4}(\s?\d{4})?$/, // Lebanon: 1234 or 1234 5678
    EG: /^\d{5}$/, // Egypt: 12345
  };
  
  const pattern = patterns[countryCode];
  return pattern ? pattern.test(postalCode) : true; // Default to true for unknown countries
}