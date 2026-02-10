
export type UserRole = 'CUSTOMER' | 'RESTAURANT' | 'ADMIN';

export interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem extends Dish {
  quantity: number;
}

export interface Booking {
  id: string;
  queueNumber: string;
  customerName: string;
  guestCount: number;
  status: 'WAITING' | 'CALLED' | 'SEATED' | 'CANCELLED';
  preOrderItems: CartItem[];
  timestamp: Date;
  estimatedWaitMinutes: number;
}

export interface RestaurantStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageWaitTime: number;
}
