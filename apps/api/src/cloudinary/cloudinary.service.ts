import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');
// const sharp = require('sharp');

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File, folder: string = 'opnmart-products'): Promise<CloudinaryResponse> {
        // ... previous optimization logic ...

        // Fallback to original buffer for now to restore server
        const bufferToUpload = file.buffer;

        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Cloudinary upload failed: No result returned'));
                    resolve(result);
                },
            );

            streamifier.createReadStream(bufferToUpload).pipe(uploadStream);
        });
    }
}
