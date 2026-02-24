import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');
const sharp = require('sharp');

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'opnmart-stores',
  ): Promise<CloudinaryResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      // Compress and optimize image before upload
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1600, 1600, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toBuffer();

      return new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result)
              return reject(
                new Error('Cloudinary upload failed: No result returned'),
              );
            resolve(result);
          },
        );

        streamifier.createReadStream(optimizedBuffer).pipe(uploadStream);
      });
    } catch (error) {
      console.error('[CLOUDINARY_UPLOAD_ERROR]', error);
      // Fallback to original buffer if sharp fails (e.g. non-image file)
      return new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Cloudinary upload failed'));
            resolve(result);
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    }
  }
}
