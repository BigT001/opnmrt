import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  Post,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('stores')
export class StoresController {
  constructor(
    private storesService: StoresService,
    private cloudinaryService: CloudinaryService
  ) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file);
    return { url: result.secure_url };
  }

  @Get('resolve')
  async resolveStore(
    @Query('subdomain') subdomain?: string,
    @Query('domain') domain?: string,
  ) {
    if (subdomain) {
      return this.storesService.findBySubdomain(subdomain);
    }
    if (domain) {
      return this.storesService.findByCustomDomain(domain);
    }
    return { message: 'Provide subdomain or domain to resolve' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'heroImage', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles()
    files: { logo?: Express.Multer.File[]; heroImage?: Express.Multer.File[] },
  ) {
    const data = { ...body };
    return this.storesService.update(id, data, files);
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    try {
      return await this.storesService.getStoreStats(id);
    } catch (error) {
      console.error('[GET_STATS_ERROR]', error);
      throw error;
    }
  }

  @Get(':id/customers')
  async getCustomers(@Param('id') id: string) {
    return this.storesService.getCustomers(id);
  }

  @Get(':id/customer-stats')
  async getCustomerStats(@Param('id') id: string) {
    return this.storesService.getCustomerStats(id);
  }

  @Get(':id/customers/:customerId')
  async getCustomerDetails(
    @Param('id') storeId: string,
    @Param('customerId') customerId: string,
  ) {
    return this.storesService.getCustomerDetails(storeId, customerId);
  }
}
