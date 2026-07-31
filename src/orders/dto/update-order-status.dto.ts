import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import type { OrderStatus } from '../interfaces/order.interface';

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: 'processing',
    enum: ['pending', 'processing', 'completed', 'cancelled'],
  })
  @IsIn(['pending', 'processing', 'completed', 'cancelled'])
  status: OrderStatus;
}
