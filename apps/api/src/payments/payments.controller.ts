import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Req,
  RawBodyRequest,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  // ── Public: Paystack Webhook (no JWT, signature-verified) ──
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhookBase(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-paystack-signature') signature: string,
  ) {
    const rawBody = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));
    return this.paymentsService.handleWebhook(rawBody, signature);
  }

  @Post('webhook/:storeId')
  @HttpCode(HttpStatus.OK)
  async webhookWithStoreId(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-paystack-signature') signature: string,
    @Param('storeId') storeId: string,
  ) {
    const rawBody = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));
    return this.paymentsService.handleWebhook(rawBody, signature, storeId);
  }

  // ── Seller: Config & Transactions ──
  @Get('config')
  @UseGuards(AuthGuard('jwt'))
  async getConfig(@Query('storeId') storeId: string) {
    return this.paymentsService.getStorePaymentConfig(storeId);
  }

  @Get('transactions')
  @UseGuards(AuthGuard('jwt'))
  async getTransactions(@Query('storeId') storeId: string) {
    return this.paymentsService.getSellerTransactions(storeId);
  }

  // ── Buyer: Initialize Payment ──
  @Post('initialize')
  @UseGuards(AuthGuard('jwt'))
  async initializePayment(
    @Body()
    data: {
      email: string;
      amount: number;
      orderId: string;
      storeId: string;
      metadata?: Record<string, any>;
    },
  ) {
    const result = await this.paymentsService.initializePayment(data);
    console.log(`[PAYMENTS_DEBUG] 📤 Returning initialization result for order ${data.orderId}`);
    return result;
  }

  // ── Verify Payment (server-side, after redirect) ──
  @Post('verify')
  @UseGuards(AuthGuard('jwt'))
  async verify(
    @Body() data: { reference: string; orderId?: string },
  ) {
    console.log(`[PAYMENTS_DEBUG] 📥 Received verify request for order ${data.orderId} (ref: ${data.reference})`);
    return this.paymentsService.verifyPayment(data.reference, data.orderId);
  }



  // ── Seller: Refund ──
  @Post('refund')
  @UseGuards(AuthGuard('jwt'))
  async refund(
    @Body() data: { reference: string; amount?: number },
  ) {
    return this.paymentsService.refundPayment(data.reference, data.amount);
  }
}
