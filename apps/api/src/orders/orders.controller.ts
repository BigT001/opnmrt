import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) { }

  @Get('my-orders')
  @UseGuards(AuthGuard('jwt'))
  async getMyOrders(@GetUser('userId') userId: string) {
    return this.ordersService.findByBuyerId(userId);
  }

  @Get('seller')
  @UseGuards(AuthGuard('jwt'))
  async getSellerOrders(@GetUser('userId') userId: string) {
    return this.ordersService.findBySellerUserId(userId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createOrder(
    @GetUser('userId') userId: string,
    @Body()
    data: {
      storeId: string;
      totalAmount: number;
      vatAmount?: number;
      customerName?: string;
      customerEmail?: string;
      items: { productId: string; quantity: number; price: number }[];
    },
  ) {
    return this.ordersService.create(userId, data);
  }

  @Post('offline')
  @UseGuards(AuthGuard('jwt'))
  async createOfflineOrder(
    @GetUser('userId') userId: string,
    @Body()
    data: {
      storeId: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      paymentMethod?: string;
      discount?: number;
      totalAmount: number;
      vatAmount?: number;
      items: { productId: string; quantity: number; price: number }[];
    },
  ) {
    return this.ordersService.createOfflineOrder(userId, data);
  }

  @Patch(':orderId/abandon')
  async trackAbandonment(
    @Param('orderId') orderId: string,
    @Body() data: { reason?: string },
  ) {
    return this.ordersService.trackAbandonment(orderId, data.reason);
  }
  @Patch(':orderId/status')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(
    @GetUser('userId') userId: string,
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatusBySeller(userId, orderId, status);
  }
}
