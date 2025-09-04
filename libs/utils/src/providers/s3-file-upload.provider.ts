import { BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, config } from 'aws-sdk';
// import { UploadedFileDto } from '../dto/uploaded-file.dto';
import {
  FileUploadProvider,
  UploadedFileDto,
} from '../interfaces/file-upload.interface';
// import { FileUploadProvider } from '../file-upload.interface';

export class S3FileUploadProvider implements FileUploadProvider {
  private s3: S3;
  private readonly logger = new Logger(S3FileUploadProvider.name);
  constructor(private configService: ConfigService) {
    config.update({
      accessKeyId: configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      region: configService.get('AWS_S3_REGION'),
    });
    this.s3 = new S3({
      accessKeyId: configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    });
    this.logger.debug('S3 Initialized');
  }

  static uniqueFilename() {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2);
    return `${timestamp}-${randomString}`;
  }

  async upload(file: Express.Multer.File): Promise<UploadedFileDto> {
    try {
      file = this.restoreBuffer(file);
      const fileName = S3FileUploadProvider.uniqueFilename();
      const newFileName = `${this.configService.get(
        'AWS_S3_UPLOAD_FOLDER',
      )}/${fileName}`;
      const uploadResult = await this.s3
        .upload({
          Bucket: this.configService.get('AWS_S3_BUCKET'),
          Body: file.buffer,
          Key: `${newFileName}${file.fieldname}${file.fieldname}`,
          ContentType: file.mimetype,
        })
        .promise();

      const uploadedFile: UploadedFileDto = {
        name: file.originalname,
        url: uploadResult.Location,
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

  async remove(url: string) {
    const key = this.extractKeyFromUrl(url);
    await this.s3.deleteObject();
  }

  private extractKeyFromUrl(url: string): string {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // remove leading "/"
  }
}
