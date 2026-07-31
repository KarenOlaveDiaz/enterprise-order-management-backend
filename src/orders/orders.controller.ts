import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import type { Order } from './interfaces/order.interface';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  @ApiOkResponse({ description: 'Orders returned successfully' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  findAll(): Order[] {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by id' })
  @ApiOkResponse({ description: 'Order returned successfully' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  findOne(@Param('id') id: string): Order {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  @ApiCreatedResponse({ description: 'Order created successfully' })
  create(@Body() createOrderDto: CreateOrderDto): Order {
    return this.ordersService.create(createOrderDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update an order status' })
  @ApiOkResponse({ description: 'Order status updated successfully' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Order {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiNoContentResponse({ description: 'Order deleted successfully' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  remove(@Param('id') id: string): void {
    this.ordersService.remove(id);
  }
}
