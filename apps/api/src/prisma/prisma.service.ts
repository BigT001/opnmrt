import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // Build a safe pool-limited URL regardless of existing query params
    const buildUrl = (raw: string | undefined): string => {
      if (!raw) return '';
      try {
        const url = new URL(raw);
        if (!url.searchParams.has('connection_limit')) {
          url.searchParams.set('connection_limit', '5');
        }
        if (!url.searchParams.has('pool_timeout')) {
          url.searchParams.set('pool_timeout', '20');
        }
        return url.toString();
      } catch {
        // Fallback: return as-is if URL parsing fails
        return raw;
      }
    };

    super({
      datasources: {
        db: { url: buildUrl(process.env.DATABASE_URL) },
      },
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
