import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import axios from 'axios';
import { EncryptionUtil } from '../common/encryption.util';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  async connectStore(
    storeId: string,
    data: { publicKey: string; secretKey: string },
  ) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    //@ts-ignore
    if (!store) throw new NotFoundException('Store not found');

    // Simple validation of keys (check format)
    if (
      !data.publicKey.startsWith('pk_') ||
      !data.secretKey.startsWith('sk_')
    ) {
      throw new BadRequestException(
        'Invalid Paystack key format. Public keys start with pk_ and Secret keys with sk_',
      );
    }

    // Test the secret key with a small API call to Paystack
    try {
      await axios.get('https://api.paystack.co/controlpanel/details', {
        headers: { Authorization: `Bearer ${data.secretKey}` },
      });
    } catch (error) {
      // If it fails with 401, key is definitely wrong.
      // Note: controlpanel/details might not be available for all keys,
      // but usually /transaction works. Let's try /transaction
      try {
        await axios.get('https://api.paystack.co/transaction?perPage=1', {
          headers: { Authorization: `Bearer ${data.secretKey}` },
        });
      } catch (err) {
        throw new BadRequestException(
          'Could not verify Paystack Secret Key. Please check the key and try again.',
        );
      }
    }

    // Encrypt the secret key before storing
    const encryptedSecretKey = await EncryptionUtil.encrypt(data.secretKey);

    return this.prisma.store.update({
      where: { id: storeId },
      data: {
        //@ts-ignore
        paystackPublicKey: data.publicKey,
        //@ts-ignore
        paystackSecretKey: encryptedSecretKey,
      },
    });
  }

  async getStorePaymentConfig(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: {
        //@ts-ignore
        paystackPublicKey: true,
        id: true,
        name: true,
      },
    });

    if (!store) throw new NotFoundException('Store not found');
    return store;
  }

  // This would be used during checkout to get the correct public key
  async getStoreKeys(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) return null;

    // Decrypt the secret key before returning
    //@ts-ignore
    const decryptedSecretKey = store.paystackSecretKey
      ? //@ts-ignore
        await EncryptionUtil.decrypt(store.paystackSecretKey)
      : null;

    return {
      //@ts-ignore
      publicKey: store.paystackPublicKey,
      secretKey: decryptedSecretKey,
    };
  }

  async verifyPayment(storeId: string, reference: string, orderId?: string) {
    const keys = await this.getStoreKeys(storeId);
    if (!keys || !keys.secretKey) {
      throw new BadRequestException('Store has not configured Paystack keys');
    }

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${keys.secretKey}` },
        },
      );

      const paymentData = response.data.data;

      if (paymentData.status === 'success') {
        if (orderId) {
          await this.ordersService.updateOrderStatus(
            orderId,
            'PAID',
            reference,
          );
        }
      }

      return response.data;
    } catch (error) {
      console.error(
        'Paystack Verification Error:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('Payment verification failed');
    }
  }
}
