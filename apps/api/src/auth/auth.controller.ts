import { Controller, Post, Get, Body, UsePipes, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RegisterSchema, LoginSchema } from '@opnmart/shared';
import type { RegisterInput, LoginInput } from '@opnmart/shared';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';

// For the combined register (user + store), we'll define a quick local schema
// but in a larger app we'd put this in @opnmart/shared
import { z } from 'zod';

const ExtendedRegisterSchema = RegisterSchema.extend({
    subdomain: z.string().optional(),
    storeName: z.string().optional(),
});

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('send-otp')
    async sendOtp(@Body() body: { email: string; phone?: string }) {
        return this.authService.sendOtp(body.email, body.phone);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() body: { email: string; otp: string; phone?: string }) {
        return this.authService.verifyOtp(body.email, body.otp, body.phone);
    }

    @Post('register')
    @UsePipes(new ZodValidationPipe(ExtendedRegisterSchema))
    async register(@Body() body: any) {
        return this.authService.register(body);
    }

    @Post('login')
    @UsePipes(new ZodValidationPipe(LoginSchema))
    async login(@Body() body: LoginInput) {
        return this.authService.login(body);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getMe(@GetUser('userId') userId: string) {
        return this.authService.getMe(userId);
    }
}
