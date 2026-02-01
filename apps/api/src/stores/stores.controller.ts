import { Controller, Get, Param, Query, Patch, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { StoresService } from './stores.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('stores')
export class StoresController {
    constructor(private storesService: StoresService) { }

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
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'logo', maxCount: 1 },
        { name: 'heroImage', maxCount: 1 },
    ]))
    async update(
        @Param('id') id: string,
        @Body() body: any,
        @UploadedFiles() files: { logo?: Express.Multer.File[], heroImage?: Express.Multer.File[] },
    ) {
        const data = { ...body };
        return this.storesService.update(id, data, files);
    }

    @Get(':id/stats')
    async getStats(@Param('id') id: string) {
        return this.storesService.getStoreStats(id);
    }
}
