import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './repositories/orders.repository';
import { PrismaOrdersRepository } from './repositories/prisma-orders.repository';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
  ],
})
export class OrdersModule {}
