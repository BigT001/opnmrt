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
    console.log(`[PAYMENTS_DEBUG] 🚀 Initializing payment for order ${data.orderId}, store ${data.storeId}`);
    const keys = await this.getStoreKeys(data.storeId);
    if (!keys) {
      console.error(`[PAYMENTS_DEBUG] ❌ Store ${data.storeId} not found`);
      throw new NotFoundException('Store not found');
    }

    const { secretKey, publicKey, store } = keys;

    if (!secretKey || !publicKey) {
      console.error(`[PAYMENTS_DEBUG] ❌ Keys missing for store ${data.storeId}`);
      throw new BadRequestException(
        'Store payment account is not configured. Please provide your Paystack API keys.',
      );
    }

    const reference = `OPNMRT_${data.orderId}_${Date.now()}`;
    console.log(`[PAYMENTS_DEBUG] 🏷️ Generated reference: ${reference}`);

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

      console.log(`[PAYMENTS_DEBUG] 📡 Calling Paystack initialize...`);
      const response = await axios.post(
        `${this.paystackBaseUrl}/transaction/initialize`,
        payload,
        { headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' } },
      );
      console.log(`[PAYMENTS_DEBUG] ✅ Paystack response received (status: ${response.status})`);

      // FIX: Use orderId as the unique key for upsert since orderId is @unique in the schema.
      // This prevents "Unique constraint failed" errors when a user retries payment for the same order.
      console.log(`[PAYMENTS_DEBUG] 💾 Upserting payment record for order ${data.orderId}...`);
      await this.prisma.payment.upsert({
        where: { orderId: data.orderId },
        create: {
          tenantId: store.tenantId,
          storeId: data.storeId,
          orderId: data.orderId,
          reference,
          amount: data.amount / 100, // store in Naira
          status: 'pending',
        } as any,
        update: {
          reference, // Update with the new reference for this attempt
          amount: data.amount / 100,
          status: 'pending',
        },
      });
      console.log(`[PAYMENTS_DEBUG] ✨ Payment record upserted successfully`);

      return {
        authorizationUrl: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference,
        publicKey,
      };
    } catch (error) {
      const errData = error.response?.data;
      const errMsg = errData?.message || error.message || 'Payment initialization failed';
      console.error(`[PAYMENTS_DEBUG] ❌ FAILED: ${errMsg}`, JSON.stringify(errData || error.message));
      this.logger.error(
        `Payment init failed for order ${data.orderId}. Paystack response: ${JSON.stringify(errData || error.message)}`,
      );
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

  private async processSuccessfulCharge(data: any, preVerifiedData?: any) {
    const reference = data.reference;
    if (!reference) return;

    console.log(`[PAYMENTS_DEBUG] 📦 Processing success for ref ${reference}`);

    // 1. IDEMPOTENCY CHECK — prevent duplicate processing
    const existing = await this.prisma.payment.findUnique({
      where: { reference },
    });

    if (existing && existing.status === 'success') {
      console.log(`[PAYMENTS_DEBUG] ⏩ Payment ${reference} already marked success. Skipping.`);
      return;
    }

    const metadata = data.metadata || {};
    const storeId = metadata.storeId || existing?.storeId;

    if (!storeId) {
      console.error(`[PAYMENTS_DEBUG] ❌ Missing storeId in payload for ref ${reference}`);
      return;
    }

    const keys = await this.getStoreKeys(storeId);
    if (!keys) return;

    const { secretKey: secretToUse, store } = keys;

    let verifiedData = preVerifiedData;

    // 2. Fetch fresh data if not provided (webhook path)
    if (!verifiedData) {
      try {
        console.log(`[PAYMENTS_DEBUG] 📡 Webhook: Fetching fresh verification for ref ${reference}`);
        const response = await axios.get(
          `${this.paystackBaseUrl}/transaction/verify/${reference}`,
          { headers: { Authorization: `Bearer ${secretToUse}` } },
        );
        verifiedData = response.data.data;
      } catch (error) {
        console.error(`[PAYMENTS_DEBUG] ❌ Background verification check failed for ref ${reference}`);
        return;
      }
    }

    if (verifiedData.status !== 'success') {
      console.warn(`[PAYMENTS_DEBUG] ⚠️ Transaction ${reference} status is not success: ${verifiedData.status}`);
      return;
    }

    // 3. Extract financial breakdown
    const amountGross = verifiedData.amount; // in kobo
    const paystackFee = verifiedData.fees || 0; // in kobo
    const amountNet = amountGross - paystackFee;
    const paymentMethod = verifiedData.channel || 'card';
    const orderId = metadata.orderId || existing?.orderId;

    if (!orderId) {
      console.error(`[PAYMENTS_DEBUG] ❌ Missing orderId for ref ${reference}`);
      return;
    }

    console.log(`[PAYMENTS_DEBUG] 💳 Completing transaction in database for order ${orderId}...`);

    // 4. ATOMIC FULFILLMENT: Payment Update + Order Update
    try {
      console.log(`[PAYMENTS_DEBUG] ⛓️ Starting atomic transaction for order ${orderId}...`);
      await this.prisma.$transaction(async (tx) => {
        console.log(`[PAYMENTS_DEBUG] 📝 [Step 1/2] Upserting payment for order ${orderId}`);
        // a. Update/Create payment record
        await tx.payment.upsert({
          where: { orderId: orderId },
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
            settlementStatus: 'settled',
            metadata: verifiedData,
          } as any,
          update: {
            reference,
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

        console.log(`[PAYMENTS_DEBUG] 🔄 [Step 2/2] Triggering status update for order ${orderId}`);
        // b. Mark order as PAID (passing the transaction client)
        await this.ordersService.updateOrderStatus(orderId, 'PAID', reference, tx);
        console.log(`[PAYMENTS_DEBUG] 🏁 Atomic transaction steps completed for order ${orderId}`);
      }, { timeout: 20000 }); // 20s timeout

      console.log(`[PAYMENTS_DEBUG] ✅ Transaction ${reference} (Order: ${orderId}) FULFILLED`);
      this.logger.log(`Order ${orderId} marked PAID successfully`);
    } catch (error) {
      console.error(`[PAYMENTS_DEBUG] ❌ ATOMIC FULFILLMENT FAILED for order ${orderId}:`, error.message);
      this.logger.error(`Failed to fulfill order ${orderId}: ${error.message}`);
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────
  // 6. SERVER-SIDE VERIFICATION (for redirect callback)
  // ─────────────────────────────────────────────────────────
  async verifyPayment(reference: string, orderId?: string) {
    console.log(`[PAYMENTS_DEBUG] 🔍 Verifying payment reference: ${reference}...`);
    try {
      // 1. Try to find local payment record to get storeId
      const payment = await this.prisma.payment.findUnique({ where: { reference } });
      let secretToUse = this.masterSecretKey;

      if (payment) {
        const keys = await this.getStoreKeys(payment.storeId);
        if (keys) secretToUse = keys.secretKey;
      }

      console.log(`[PAYMENTS_DEBUG] 📡 Verify: Calling Paystack API for ref ${reference}...`);
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${secretToUse}` } },
      );

      const paymentData = response.data.data;
      console.log(`[PAYMENTS_DEBUG] ✅ Paystack verify status: ${paymentData.status}`);

      if (paymentData.status === 'success' && orderId) {
        console.log(`[PAYMENTS_DEBUG] 🎉 Verification successful, processing fulfillment...`);
        // Trigger fulfillment with the ALREADY FETCHED data to save an API call
        await this.processSuccessfulCharge(paymentData, paymentData);
        console.log(`[PAYMENTS_DEBUG] ✅ Fulfillment finished for order ${orderId}`);
      }

      console.log(`[PAYMENTS_DEBUG] 📤 Returning Paystack verification results to client for ref: ${reference}`);
      return response.data;
    } catch (error) {
      console.error(`[PAYMENTS_DEBUG] ❌ Verification call failed: ${error.message}`);
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
