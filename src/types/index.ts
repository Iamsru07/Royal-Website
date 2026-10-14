export type FoodCategory =
  | 'All'
  | 'Starters'
  | 'Main Course'
  | 'Biryani & Rice'
  | 'Pizza'
  | 'Burgers'
  | 'Chinese'
  | 'Beverages'
  | 'Desserts';

export type FoodType = 'veg' | 'non-veg';

export type AvailabilityStatus = 'AVAILABLE' | 'OUT OF STOCK' | 'HIDDEN';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  description: string;
  foodType: FoodType;
  prepTimeMinutes: number;
  availability: AvailabilityStatus;
  isFeatured?: boolean;
  rating?: number;
  calories?: number;
  imageUrl: string;
  images?: string[];
  spicyLevel?: 1 | 2 | 3;
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
  specialNotes?: string;
}

export type OrderStatus =
  | 'Received'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Served'
  | 'Completed'
  | 'Cancelled';

export type PaymentMethod = 'Cash' | 'Online';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Order {
  id: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  items: {
    foodId: string;
    foodName: string;
    foodType: FoodType;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  taxes: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  estimatedPrepTime: number; // in minutes
  specialNotes?: string;
}

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'INACTIVE';

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  occupiedSince?: string;
  bookedByName?: string;
  bookedByPhone?: string;
  bookedGuests?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  password?: string;
  email?: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
  status: 'Active' | 'VIP' | 'Inactive';
  createdAt?: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  transactionRef: string;
}

export interface AdvertisementBanner {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  couponCode?: string;
  ctaText: string;
  targetCategory?: FoodCategory;
  imageUrl: string;
  bgGradient: string;
  isActive: boolean;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  taxRatePercent: number;
  orderingEnabled: boolean;
  allowCashPayment: boolean;
  allowOnlinePayment: boolean;
  defaultPrepTimeMinutes: number;
  accentColor: string;
  reservationFeePerBooking?: number;
}

export interface TableReservation {
  id: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestsCount: number;
  reservationDate: string; // e.g. "2026-09-29" or "Today, 28 Sep"
  timeSlot: string; // e.g. "08:00 PM"
  specialRequests?: string;
  feeAmount: number; // Advance fee paid per booking, e.g. 99
  feePaymentStatus: 'Paid' | 'Pending';
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  transactionRef: string;
  status: 'Confirmed' | 'Seated' | 'Completed' | 'Cancelled';
  createdAt: string;
}

