import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
  ) { }

  @Post('cart/sync')
  async syncCart(
    @GetUser('userId') userId: string,
    @Body('items') items: any[],
    @Body('merge') merge?: boolean,
  ) {
    if (!userId) throw new UnauthorizedException();
    return this.usersService.syncCart(userId, items || [], merge ?? true);
  }

  @Get('profile')
  async getProfile(@GetUser('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch('profile')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @GetUser('userId') userId: string,
    @Body()
    data: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;
    if (file) {
      const result = await this.cloudinaryService.uploadFile(
        file,
        'opnmart-profiles',
      );
      imageUrl = result.secure_url;
      console.log('Profile image uploaded:', imageUrl);
    }

    // Parse JSON strings if they come as strings (multipart/form-data often sends objects as strings)
    // Important: check if it is a string first. If it's already an object (from JSON body), don't parse.
    if (data.shippingAddress && typeof data.shippingAddress === 'string') {
      try {
        data.shippingAddress = JSON.parse(data.shippingAddress);
      } catch (e) {
        // If parse fails, maybe it's just a string value? assume improper format and ignore or keep as is?
        // For now, let's keep it but formatted properly as object if possible, or undefined.
        // Actually, if it fails to parse, it might be corrupt. Let's not mutate it and hope service handles it or valid object.
        // But usersService expects an object for JSON field usually.
      }
    }
    if (data?.savedCards && typeof data.savedCards === 'string') {
      try {
        data.savedCards = JSON.parse(data.savedCards);
      } catch (e) { }
    }

    try {
      console.log('UPDATING PROFILE (MULTIPART) FOR:', userId);

      const result = await this.usersService.update(userId, {
        ...data,
        ...(imageUrl && { image: imageUrl }),
      });
      console.log('PROFILE UPDATED SUCCESSFULLY');
      return result;
    } catch (error: any) {
      console.error('CONTROLLER PROFILE UPDATE ERROR:', error);
      throw error;
    }
  }

  @Patch('profile-json')
  async updateProfileJson(
    @GetUser('userId') userId: string,
    @Body() data: any,
  ) {
    try {
      console.log('UPDATING PROFILE (JSON) FOR:', userId);
      console.log('BODY:', JSON.stringify(data));
      return await this.usersService.update(userId, data);
    } catch (error: any) {
      console.error('CONTROLLER PROFILE JSON ERROR:', error);
      throw error;
    }
  }

  @Patch('change-password')
  async changePassword(
    @GetUser('userId') userId: string,
    @Body() data: { currentPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(
      userId,
      data.currentPassword,
      data.newPassword,
    );
  }
}
