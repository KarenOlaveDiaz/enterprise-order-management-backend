import type { Order, OrderStatus } from '../../generated/prisma/client';
import type { CreateOrderDto } from '../dto/create-order.dto';

export abstract class OrdersRepository {
  abstract findAll(): Promise<Order[]>;

  abstract findOne(id: string): Promise<Order | null>;

  abstract create(createOrderDto: CreateOrderDto): Promise<Order>;

  abstract updateStatus(id: string, status: OrderStatus): Promise<Order>;

  abstract remove(id: string): Promise<void>;
}
