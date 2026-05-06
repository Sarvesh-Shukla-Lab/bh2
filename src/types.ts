export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: any;
}

export interface ServiceRequest {
  id: string;
  userId?: string;
  serviceId?: string;
  serviceName?: string;
  userName: string;
  userEmail: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: any;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  role: 'customer' | 'admin';
}
