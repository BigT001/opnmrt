import 'dotenv/config'; // RESTART_V4: 2026-02-14 11:42
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as dns from 'dns';

// Force use of Google DNS to bypass local DNS resolution issues
// dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: path.join(__dirname, '../.env') });

import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.setGlobalPrefix('api');
  app.enableCors();

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Store raw body for webhook signature verification
  // We attach it to the request so that PaymentsService can use it
  app.use(['/api/payments/webhook', '/api/payments/webhook/:storeId'], (req: any, res: any, next: any) => {
    if (req.method !== 'POST') return next();

    // If the body is already parsed by json() middleware, we can recreate the raw buffer
    if (req.body && !req.rawBody) {
      req.rawBody = Buffer.from(JSON.stringify(req.body));
    }
    next();
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
