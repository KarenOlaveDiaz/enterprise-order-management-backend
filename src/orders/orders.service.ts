import { Injectable, NotFoundException } from '@nestjs/common';
import type { Order } from '../generated/prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersRepository } from './repositories/orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepository.findAll();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne(id);

    if (!order) {
      throw new NotFoundException(`Order with id ${id} was not found`);
    }

    return order;
  }

  create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersRepository.create(createOrderDto);
  }

  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    await this.findOne(id);

    return this.ordersRepository.updateStatus(id, updateOrderStatusDto.status);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.ordersRepository.remove(id);
  }
}
