import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import type { Order } from '../generated/prisma/client';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersRepository } from './repositories/orders.repository';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  const repositoryMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  const order: Order = {
    id: 'order-1',
    customerName: 'Karen Olave',
    customerEmail: 'karen@example.com',
    product: 'Business Laptop',
    quantity: 2,
    status: 'pending',
    createdAt: new Date('2026-08-07T00:00:00.000Z'),
    updatedAt: new Date('2026-08-07T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      repositoryMock.findAll.mockResolvedValue([order]);

      const result = await service.findAll();

      expect(result).toEqual([order]);
      expect(repositoryMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an order when it exists', async () => {
      repositoryMock.findOne.mockResolvedValue(order);

      const result = await service.findOne(order.id);

      expect(result).toEqual(order);
      expect(repositoryMock.findOne).toHaveBeenCalledWith(order.id);
    });

    it('should throw NotFoundException when order does not exist', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-order')).rejects.toThrow(
        NotFoundException,
      );

      expect(repositoryMock.findOne).toHaveBeenCalledWith('missing-order');
    });
  });

  describe('create', () => {
    it('should create and return an order', async () => {
      const createDto: CreateOrderDto = {
        customerName: 'Karen Olave',
        customerEmail: 'karen@example.com',
        product: 'Business Laptop',
        quantity: 2,
      };

      repositoryMock.create.mockResolvedValue(order);

      const result = await service.create(createDto);

      expect(result).toEqual(order);
      expect(repositoryMock.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateStatus', () => {
    it('should update an existing order status', async () => {
      const updateDto: UpdateOrderStatusDto = {
        status: 'processing',
      };

      const updatedOrder: Order = {
        ...order,
        status: 'processing',
        updatedAt: new Date('2026-08-07T01:00:00.000Z'),
      };

      repositoryMock.findOne.mockResolvedValue(order);
      repositoryMock.updateStatus.mockResolvedValue(updatedOrder);

      const result = await service.updateStatus(order.id, updateDto);

      expect(result).toEqual(updatedOrder);

      expect(repositoryMock.findOne).toHaveBeenCalledWith(order.id);

      expect(repositoryMock.updateStatus).toHaveBeenCalledWith(
        order.id,
        'processing',
      );
    });

    it('should throw NotFoundException when updating a missing order', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus('missing-order', {
          status: 'completed',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repositoryMock.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an existing order', async () => {
      repositoryMock.findOne.mockResolvedValue(order);
      repositoryMock.remove.mockResolvedValue(undefined);

      await service.remove(order.id);

      expect(repositoryMock.findOne).toHaveBeenCalledWith(order.id);

      expect(repositoryMock.remove).toHaveBeenCalledWith(order.id);
    });

    it('should throw NotFoundException when removing a missing order', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      await expect(service.remove('missing-order')).rejects.toThrow(
        NotFoundException,
      );

      expect(repositoryMock.remove).not.toHaveBeenCalled();
    });
  });
});
