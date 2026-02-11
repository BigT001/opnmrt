import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Get('history/:productId')
    async getHistory(@Param('productId') productId: string) {
        return this.inventoryService.getProductHistory(productId);
    }
}
