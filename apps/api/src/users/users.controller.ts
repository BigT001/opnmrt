import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    async getProfile(@GetUser('userId') userId: string) {
        return this.usersService.findOne(userId);
    }

    @Patch('profile')
    async updateProfile(
        @GetUser('userId') userId: string,
        @Body() data: { name?: string; email?: string }
    ) {
        return this.usersService.update(userId, data);
    }

    @Patch('change-password')
    async changePassword(
        @GetUser('userId') userId: string,
        @Body() data: { currentPassword: string; newPassword: string }
    ) {
        return this.usersService.changePassword(userId, data.currentPassword, data.newPassword);
    }
}
