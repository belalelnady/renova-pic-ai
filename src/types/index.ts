export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditingSettings {
  category: 'visa' | 'absher' | 'saudi-look' | 'baby';
  size: string;
  quantity: number;
  addFrame?: boolean;
  extraPrintSets?: number;
}

export interface Photo {
  id: string;
  userId: string;
  title: string;
  aiTool: string;
  originalUrl: string;
  editedUrl?: string;
  thumbnailUrl?: string;
  editingSettings: EditingSettings;
  price: number;
  printSize: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  userId: string;
  photoId: string;
  photoTitle: string;
  photoUrl: string;
  printSize: string;
  quantity: number;
  pricePerItem: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  photo?: {
    id: string;
    title: string;
    editedUrl?: string;
    thumbnailUrl?: string;
    originalUrl: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  photoTitle: string;
  photoUrl: string;
  printSize: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: string;
  trackingNumber?: string;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
}