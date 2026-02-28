import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import axios from 'axios';
import * as crypto from 'crypto';
import { EncryptionUtil } from '../common/encryption.util';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
    private configService: ConfigService,
  ) { }

  private get masterSecretKey(): string {
    const key = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!key) {
      throw new InternalServerErrorException(
        'Paystack master secret key not configured',
      );
    }
    return key;
  }

  private get webhookSecret(): string {
    return this.configService.get<string>('PAYSTACK_WEBHOOK_SECRET') || this.masterSecretKey;
  }

  private paystackHeaders() {
    return {
      Authorization: `Bearer ${this.masterSecretKey}`,
      'Content-Type': 'application/json',
    };
  }

  // SELLER ONBOARDING methods removed as we now use direct key integration in Settings

  private async getStoreKeys(storeId: string) {
    const store = await this.prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return null;

    let secretKey = this.masterSecretKey;
    let publicKey = this.configService.get<string>('PAYSTACK_PUBLIC_KEY');
    let webhookSecret = this.webhookSecret;

    if (store.paystackSecretKey) {
      secretKey = await EncryptionUtil.decrypt(store.paystackSecretKey);
    }
    if (store.paystackPublicKey) {
      publicKey = store.paystackPublicKey;
    }
    if (store.paystackWebhookSecret) {
      webhookSecret = await EncryptionUtil.decrypt(store.paystackWebhookSecret);
    } else if (store.paystackSecretKey) {
      webhookSecret = secretKey;
    }

    return { secretKey, publicKey, webhookSecret, store };
  }


  // ─────────────────────────────────────────────────────────
  // 4. PAYMENT INITIALIZATION — Backend only
  // ─────────────────────────────────────────────────────────
  async initializePayment(data: {
    email: string;
    amount: number; // in kobo (smallest currency unit)
    orderId: string;
    storeId: string;
    metadata?: Record<string, any>;
  }) {
    const keys = await this.getStoreKeys(data.storeId);
    if (!keys) throw new NotFoundException('Store not found');

    const { secretKey, publicKey, store } = keys;

    if (!secretKey || !publicKey) {
      throw new BadRequestException(
        'Store payment account is not configured. Please provide your Paystack API keys.',
      );
    }

    const reference = `OPNMRT_${data.orderId}_${Date.now()}`;

    try {
      const payload: any = {
        email: data.email,
        amount: data.amount, // already in kobo
        reference,
        metadata: {
          orderId: data.orderId,
          storeId: data.storeId,
          ...(data.metadata || {}),
        },
      };

      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        payload,
        { headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' } },
      );

      // Create a pending payment record
      await this.prisma.payment.upsert({
        where: { reference },
        create: {
          tenantId: store.tenantId,
          storeId: data.storeId,
          orderId: data.orderId,
          reference,
          amount: data.amount / 100, // store in Naira
          status: 'pending',
        } as any,
        update: {},
      });

      return {
        authorizationUrl: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference,
        publicKey,
      };
    } catch (error) {
      const errMsg =
        error.response?.data?.message || 'Payment initialization failed';
      this.logger.error(`Payment init failed for order ${data.orderId}: ${errMsg}`);
      throw new BadRequestException(errMsg);
    }
  }

  // ─────────────────────────────────────────────────────────
  // 5. WEBHOOK — Verify & Process (Critical)
  // ─────────────────────────────────────────────────────────
  async handleWebhook(rawBody: Buffer, signature: string, pathStoreId?: string) {
    let event: any;
    try {
      event = JSON.parse(rawBody.toString());
    } catch {
      throw new BadRequestException('Invalid webhook payload');
    }

    // 2. Verify signature dynamically
    const storeId = pathStoreId || event.data?.metadata?.storeId;
    let webhookSecretToUse = this.webhookSecret;

    if (storeId) {
      const keys = await this.getStoreKeys(storeId);
      if (keys) {
        webhookSecretToUse = keys.webhookSecret;
      }
    }

    const hash = crypto
      .createHmac('sha512', webhookSecretToUse)
      .update(rawBody)
      .digest('hex');

    if (hash !== signature) {
      this.logger.warn('Invalid Paystack webhook signature received');
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Webhook received: ${event.event}`);

    if (event.event === 'charge.success') {
      await this.processSuccessfulCharge(event.data);
    }

    return { received: true };
  }

  private async processSuccessfulCharge(data: any) {
    const reference = data.reference;
    if (!reference) return;

    // IDEMPOTENCY CHECK — prevent duplicate processing
    const existing = await this.prisma.payment.findUnique({
      where: { reference },
    });

    if (existing && existing.status === 'success') {
      this.logger.log(`Duplicate webhook for reference ${reference}, skipping`);
      return;
    }

    const metadata = data.metadata || {};
    const storeId = metadata.storeId || existing?.storeId;

    if (!storeId) {
      this.logger.error(`Missing storeId in webhook for reference ${reference}`);
      return;
    }

    const keys = await this.getStoreKeys(storeId);
    if (!keys) return;

    const { secretKey: secretToUse, store } = keys;

    let verifiedData: any;
    try {
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${secretToUse}` } },
      );
      verifiedData = response.data.data;
    } catch (error) {
      this.logger.error(`Verification failed for reference ${reference}: ${error.message}`);
      return;
    }

    if (verifiedData.status !== 'success') {
      this.logger.warn(`Transaction ${reference} status is not success: ${verifiedData.status}`);
      return;
    }

    // 3. Extract financial breakdown
    const amountGross = verifiedData.amount; // in kobo
    const paystackFee = verifiedData.fees || 0; // in kobo
    const amountNet = amountGross - paystackFee;
    const paymentMethod = verifiedData.channel || 'card';
    const orderId = metadata.orderId || existing?.orderId;

    if (!orderId) {
      this.logger.error(`Missing orderId in webhook for reference ${reference}`);
      return;
    }

    // 4. Update payment record with full breakdown
    await this.prisma.payment.upsert({
      where: { reference },
      create: {
        tenantId: store.tenantId,
        storeId,
        orderId,
        reference,
        amount: amountGross / 100,
        amountGross: amountGross / 100,
        paystackFee: paystackFee / 100,
        amountNet: amountNet / 100,
        paymentMethod,
        status: 'success',
        settlementStatus: 'settled', // Directly to merchant account
        metadata: verifiedData,
      } as any,
      update: {
        amount: amountGross / 100,
        amountGross: amountGross / 100,
        paystackFee: paystackFee / 100,
        amountNet: amountNet / 100,
        paymentMethod,
        status: 'success',
        settlementStatus: 'pending',
        metadata: verifiedData,
      } as any,
    });

    // 5. Mark order as PAID
    try {
      await this.ordersService.updateOrderStatus(orderId, 'PAID', reference);
      this.logger.log(`Order ${orderId} marked PAID via webhook`);
    } catch (error) {
      this.logger.error(`Failed to update order ${orderId} status: ${error.message}`);
    }
  }

  // ─────────────────────────────────────────────────────────
  // 6. SERVER-SIDE VERIFICATION (for redirect callback)
  // ─────────────────────────────────────────────────────────
  async verifyPayment(reference: string, orderId?: string) {
    try {
      // 1. Try to find local payment record to get storeId
      const payment = await this.prisma.payment.findUnique({ where: { reference } });
      let secretToUse = this.masterSecretKey;

      if (payment) {
        const keys = await this.getStoreKeys(payment.storeId);
        if (keys) secretToUse = keys.secretKey;
      }

      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${secretToUse}` } },
      );

      const paymentData = response.data.data;

      if (paymentData.status === 'success' && orderId) {
        // Also trigger processSuccessfulCharge for safety (idempotent)
        await this.processSuccessfulCharge(paymentData);
      }

      return response.data;
    } catch (error) {
      throw new BadRequestException('Payment verification failed');
    }
  }

  // ─────────────────────────────────────────────────────────
  // 7. SELLER PAYMENT CONFIG / STATUS
  // ─────────────────────────────────────────────────────────
  async getStorePaymentConfig(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) throw new NotFoundException('Store not found');

    return {
      id: store.id,
      name: store.name,
      paystackPublicKey: store.paystackPublicKey,
      paystackSecretKey: store.paystackSecretKey ? '********' : null,
      paystackWebhookSecret: store.paystackWebhookSecret ? '********' : null,
    };
  }

  // ─────────────────────────────────────────────────────────
  // 8. SELLER TRANSACTIONS DASHBOARD
  // ─────────────────────────────────────────────────────────
  async getSellerTransactions(storeId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { storeId, status: 'success' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }) as any[];

    const totalGross = payments.reduce((sum, p) => sum + Number(p.amountGross || p.amount || 0), 0);
    const totalFees = payments.reduce((sum, p) => sum + Number(p.paystackFee || 0), 0);
    const totalNet = payments.reduce((sum, p) => sum + Number(p.amountNet || p.amount || 0), 0);

    return {
      transactions: payments,
      summary: {
        totalGross,
        totalFees,
        totalNet,
        count: payments.length,
      },
    };
  }

  // ─────────────────────────────────────────────────────────
  // 9. REFUND (Basic)
  // ─────────────────────────────────────────────────────────
  async refundPayment(reference: string, amount?: number) {
    const payment = await this.prisma.payment.findUnique({ where: { reference } });
    if (!payment) throw new NotFoundException('Payment not found');

    try {
      const payload: any = { transaction: reference };
      if (amount) payload.amount = amount * 100; // convert to kobo

      const response = await axios.post(
        `${this.paystackBaseUrl}/refund`,
        payload,
        { headers: this.paystackHeaders() },
      );

      await this.prisma.payment.update({
        where: { reference },
        data: { status: 'refunded' } as any,
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException(
        error.response?.data?.message || 'Refund failed',
      );
    }
  }
}
