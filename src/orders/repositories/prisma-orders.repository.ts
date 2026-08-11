import { Injectable } from '@nestjs/common';
import type { Order, OrderStatus } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateOrderDto } from '../dto/create-order.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data: {
        customerName: createOrderDto.customerName,
        customerEmail: createOrderDto.customerEmail,
        product: createOrderDto.product,
        quantity: createOrderDto.quantity,
      },
    });
  }

  updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    });
  }
}
