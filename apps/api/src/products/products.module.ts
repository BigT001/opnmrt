import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductAiService } from './product-ai.service';

@Module({
  imports: [CloudinaryModule, PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductAiService],
  exports: [ProductsService, ProductAiService],
})
export class ProductsModule { }
