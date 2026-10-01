export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  coverImage: string;
  stock: number;
  // Extended fields for enriched details page
  publishedYear?: number;
  publisher?: string;
  pages?: number;
  isbn?: string;
  featured?: boolean;
  bestseller?: boolean;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'title-asc'
  | 'title-desc';

export interface BookFilters {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: SortOption;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingInfo {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutFormState {
  customer: CustomerInfo;
  shipping: ShippingInfo;
  paymentMethod: 'credit-card' | 'paypal' | 'apple-pay';
  cardholderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface OrderConfirmation {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  customer: CustomerInfo;
  shipping: ShippingInfo;
  estimatedDelivery: string;
}
