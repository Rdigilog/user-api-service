import { BadRequestException, Logger } from '@nestjs/common';
import {
  FileUploadProvider,
  UploadedFileDto,
} from '../interfaces/file-upload.interface';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';
export class CooudinaryFileUploadProvider implements FileUploadProvider {
  private readonly logger = new Logger(CooudinaryFileUploadProvider.name);
  constructor(private configService: ConfigService) {
    this.logger.debug(' Initialized');
  }
  static uniqueFilename() {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2);
    return `${timestamp}-${randomString}`;
  }

  async upload(file: Express.Multer.File): Promise<UploadedFileDto> {
    try {
      file = this.restoreBuffer(file);
      const fileName = CooudinaryFileUploadProvider.uniqueFilename();
      const newFileName = `${this.configService.get(
        'AWS_S3_UPLOAD_FOLDER',
      )}/${fileName}`;
      const uploadResult = await this.cloudinaryUpload(file);

      const uploadedFile: UploadedFileDto = {
        name: file.originalname,
        url: uploadResult.secure_url,
      };

      // console.log(uploadResult);

      return uploadedFile;
    } catch (err) {
      this.logger.log(err);
      console.log(err.stack);
      throw new BadRequestException('Error uploading file to S3.');
    }
  }

  restoreBuffer(file: any) {
    if (file?.buffer?.type === 'Buffer' && Array.isArray(file.buffer.data)) {
      file.buffer = Buffer.from(file.buffer.data);
    }
    return file as Express.Multer.File;
  }

  async cloudinaryUpload(file: Express.Multer.File) {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
      formData.append(
        'upload_preset',
        this.configService.get('CLOUD_UPLOAD_PRESET') || 'unsigned',
      );
      formData.append(
        'cloud_name',
        this.configService.get('CLOUD_NAME') || 'dwhvilwc3',
      );
      const uploadName = this.configService.get('CLOUD_NAME') || 'dwhvilwc3';
      const baseUrl =
        this.configService.get('CLOUDINARY_BASEURL') || 'https://api.cloudinary.com/v1_1/';
      const response = await axios.post(
        `${baseUrl}${uploadName}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // The response will contain the result of the upload
      // console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e);
      return e.message;
    }
  }

  async remove(url: string) {
    const publicId = this.extractPublicId(url);

    const cloudName = this.configService.get('CLOUD_NAME') || 'dwhvilwc3';
    const apiKey = this.configService.get('CLOUDINARY_API_KEY') || '';
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');
    // const baseUrl =
      // this.configService.get() || 'https://api.cloudinary.com/v1_1/';
    const endpoint = `${this.configService.get('CLOUDINARY_BASEURL')}${cloudName}/resources/image/upload`;

    const response = await axios.delete(endpoint, {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
      params: {
        public_ids: [publicId],
      },
    });

    return response.data;
  }

  extractPublicId(url: string): string {
    // Remove query params if any
    const cleanUrl = url.split('?')[0];

    // Get the last part after /upload/
    const parts = cleanUrl.split('/upload/')[1].split('/');

    // Join everything after /upload/ as the folder+filename
    const publicIdWithExt = parts.join('/');

    // Remove extension (.jpg, .png, etc.)
    return publicIdWithExt.replace(/\.[^/.]+$/, '');
  }
}
