import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private ordersService: OrdersService) { }

  @Get('my-orders')
  async getMyOrders(@GetUser('userId') userId: string) {
    return this.ordersService.findByBuyerId(userId);
  }

  @Get('seller')
  async getSellerOrders(@GetUser('userId') userId: string) {
    return this.ordersService.findBySellerUserId(userId);
  }

  @Post()
  async createOrder(
    @GetUser('userId') userId: string,
    @Body()
    data: {
      storeId: string;
      totalAmount: number;
      items: { productId: string; quantity: number; price: number }[];
    },
  ) {
    return this.ordersService.createOrder(userId, data);
  }
}
