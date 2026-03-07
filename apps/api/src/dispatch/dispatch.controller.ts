import { Controller, Get, Post, Body, Param, Patch, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('dispatch')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DispatchController {
    constructor(
        private readonly dispatchService: DispatchService,
        private readonly cloudinary: CloudinaryService
    ) { }

    @Get('radar')
    @Roles('ADMIN', 'DISPATCH')
    async getRadarTasks() {
        return this.dispatchService.getRadarTasks();
    }

    @Get('active')
    @Roles('ADMIN', 'DISPATCH')
    async getActiveDeliveries(@GetUser('userId') userId: string) {
        return this.dispatchService.getActiveDeliveries(userId);
    }

    @Get('history')
    @Roles('ADMIN', 'DISPATCH')
    async getHistoryDeliveries(@GetUser('userId') userId: string) {
        return this.dispatchService.getHistoryDeliveries(userId);
    }

    @Post('broadcast')
    @Roles('SELLER', 'ADMIN')
    async broadcastOrder(
        @GetUser('userId') userId: string,
        @Body() body: { orderId: string; fee: number; pickup: string; dropoff: string }
    ) {
        return this.dispatchService.broadcastOrder(userId, body);
    }

    @Get('task/:id')
    @Roles('DISPATCH', 'ADMIN')
    async getTaskById(@GetUser('userId') userId: string, @Param('id') id: string) {
        return this.dispatchService.getTaskById(userId, id);
    }

    @Patch('task/:id/accept')
    @Roles('DISPATCH', 'ADMIN')
    async acceptTask(@GetUser('userId') userId: string, @Param('id') id: string) {
        return this.dispatchService.acceptTask(userId, id);
    }

    @Patch('task/:id/status')
    @Roles('DISPATCH', 'ADMIN')
    async updateTaskStatus(@GetUser('userId') userId: string, @Param('id') id: string, @Body('status') status: string) {
        return this.dispatchService.updateTaskStatus(userId, id, status);
    }

    @Get('store/active')
    @Roles('SELLER', 'ADMIN')
    async getStoreActiveDeliveries(@GetUser('userId') userId: string) {
        return this.dispatchService.getStoreActiveDeliveries(userId);
    }

    @Get('stats/earnings')
    @Roles('DISPATCH', 'ADMIN')
    async getEarningsStats(@GetUser('userId') userId: string) {
        return this.dispatchService.getEarningsStats(userId);
    }

    @Post('upload-doc')
    @Roles('DISPATCH', 'ADMIN')
    @UseInterceptors(FileInterceptor('file'))
    async uploadDoc(@UploadedFile() file: Express.Multer.File) {
        const result = await this.cloudinary.uploadFile(file, 'dispatch-docs');
        return { url: result.secure_url };
    }

    @Patch('profile')
    @Roles('DISPATCH', 'ADMIN')
    async updateProfile(@GetUser('userId') userId: string, @Body() data: any) {
        return this.dispatchService.updateProfile(userId, data);
    }

    // --- Rider Management ---

    @Post('riders')
    @Roles('DISPATCH', 'ADMIN')
    async addRider(@GetUser('userId') userId: string, @Body() data: any) {
        return this.dispatchService.addRider(userId, data);
    }

    @Get('riders')
    @Roles('DISPATCH', 'ADMIN')
    async getRiders(@GetUser('userId') userId: string) {
        return this.dispatchService.getRiders(userId);
    }

    @Patch('riders/:id')
    @Roles('DISPATCH', 'ADMIN')
    async updateRider(@GetUser('userId') userId: string, @Param('id') id: string, @Body() data: any) {
        return this.dispatchService.updateRider(userId, id, data);
    }

    @Patch('task/:taskId/assign')
    @Roles('DISPATCH', 'ADMIN')
    async assignRider(@GetUser('userId') userId: string, @Param('taskId') taskId: string, @Body('riderId') riderId: string) {
        return this.dispatchService.assignRider(userId, taskId, riderId);
    }
}
