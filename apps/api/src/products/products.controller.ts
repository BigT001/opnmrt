import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    UseInterceptors,
    UploadedFiles,
    Query,
    Param,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('images', 5))
    async create(
        @Body() body: any,
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
                fileIsRequired: false,
            }),
        )
        files?: Express.Multer.File[],
    ) {
        const data = {
            name: body.name,
            description: body.description,
            price: parseFloat(body.price),
            discountPrice: body.discountPrice ? parseFloat(body.discountPrice) : undefined,
            stock: parseInt(body.stock, 10),
            category: body.category,
            colors: body.colors ? JSON.parse(body.colors) : [],
            sizes: body.sizes ? JSON.parse(body.sizes) : [],
        };

        const storeId = body.storeId;

        return this.productsService.create(storeId, data, files);
    }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('images', 5))
    async update(
        @Param('id') id: string,
        @Body() body: any,
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
                fileIsRequired: false,
            }),
        )
        files?: Express.Multer.File[],
    ) {
        const data: any = { ...body };
        if (body.price) data.price = parseFloat(body.price);
        if (body.discountPrice) data.discountPrice = parseFloat(body.discountPrice);
        if (body.stock) data.stock = parseInt(body.stock, 10);
        if (body.colors) data.colors = JSON.parse(body.colors);
        if (body.sizes) data.sizes = JSON.parse(body.sizes);
        if (body.existingImages) data.existingImages = JSON.parse(body.existingImages);

        return this.productsService.update(id, data, files);
    }

    @Get()
    async findAll(@Query('subdomain') subdomain: string) {
        return this.productsService.findAll(subdomain);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }
}
