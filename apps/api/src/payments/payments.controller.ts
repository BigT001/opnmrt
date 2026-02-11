import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('connect')
  async connectStore(
    @GetUser('userId') userId: string,
    @Body()
    data: {
      storeId: string;
      publicKey: string;
      secretKey: string;
    },
  ) {
    // In a real app, we'd verify user owns storeId here
    return this.paymentsService.connectStore(data.storeId, data);
  }

  @Get('config')
  async getConfig(@Query('storeId') storeId: string) {
    return this.paymentsService.getStorePaymentConfig(storeId);
  }

  @Post('verify')
  async verify(
    @Body() data: { storeId: string; reference: string; orderId?: string },
  ) {
    return this.paymentsService.verifyPayment(
      data.storeId,
      data.reference,
      data.orderId,
    );
  }
}
