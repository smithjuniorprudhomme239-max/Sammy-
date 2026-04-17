export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  isVerified: boolean;
  avatar?: string;
  address?: Address;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  sku: string;
  specs?: Record<string, string>;
  tags?: string[];
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  product: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  products?: T[];
  total: number;
  pages: number;
  page: number;
}
