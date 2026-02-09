import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('stats')
    async getStats() {
        return this.adminService.getStats();
    }

    @Get('sellers')
    async getSellers() {
        return this.adminService.getSellers();
    }

    @Get('sellers/:id')
    async getSellerDetail(@Param('id') id: string) {
        return this.adminService.getSellerDetail(id);
    }

    @Get('buyers')
    async getBuyers() {
        return this.adminService.getBuyers();
    }

    @Get('orders')
    async getOrders() {
        return this.adminService.getOrders();
    }
}
