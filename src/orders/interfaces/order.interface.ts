export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  product: string;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
