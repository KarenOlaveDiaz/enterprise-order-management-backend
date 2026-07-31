import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { Order } from './interfaces/order.interface';

@Injectable()
export class OrdersService {
  private readonly orders: Order[] = [
    {
      id: randomUUID(),
      customerName: 'Demo Customer',
      customerEmail: 'customer@orderflow.dev',
      product: 'Enterprise Monitor',
      quantity: 2,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: string): Order {
    const order = this.orders.find((item) => item.id === id);

    if (!order) {
      throw new NotFoundException(`Order with id ${id} was not found`);
    }

    return order;
  }

  create(createOrderDto: CreateOrderDto): Order {
    const timestamp = new Date().toISOString();

    const order: Order = {
      id: randomUUID(),
      ...createOrderDto,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.orders.push(order);

    return order;
  }

  updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Order {
    const order = this.findOne(id);

    order.status = updateOrderStatusDto.status;
    order.updatedAt = new Date().toISOString();

    return order;
  }

  remove(id: string): void {
    const orderIndex = this.orders.findIndex((order) => order.id === id);

    if (orderIndex === -1) {
      throw new NotFoundException(`Order with id ${id} was not found`);
    }

    this.orders.splice(orderIndex, 1);
  }
}
