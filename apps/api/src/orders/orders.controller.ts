import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
