import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UtilsService } from './services/utils.service';
import { OtpService } from './services/otp.service';
import { RedisService } from './services/redis.service';
import { GeneralService } from './services/general.service';
import { ResponsesService } from './services/responses.service';
import Redis from 'ioredis';
import { FileUploadService } from './services/file-upload.service';
import { fileUploadProviderFactory } from './services/factory.provider';

@Global()
@Module({
  imports: [ConfigModule], // 👈 make ConfigService available
  providers: [
    UtilsService,
    OtpService,
    RedisService,
    GeneralService,
    ResponsesService,
    FileUploadService,
    {
      provide: 'FileUploadProvider',
      useFactory: (configService: ConfigService) => {
        return fileUploadProviderFactory(
          configService.get('FILE_UPLOAD_PROVIDER') || 'cloudinary',
          configService,
        );
      },
      inject: [ConfigService],
    },
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis(configService.get<string>('REDIS_URL') || '');
      },
    },
  ],
  exports: [
    UtilsService,
    OtpService,
    RedisService,
    GeneralService,
    ResponsesService,
    FileUploadService,
    'REDIS_CLIENT',
  ],
})
export class UtilsModule {}
