import { CooudinaryFileUploadProvider } from '../providers/cloudinary-file-uppoad';
import { S3FileUploadProvider } from '../providers/s3-file-upload.provider';

export function fileUploadProviderFactory(
  provider: string | 'aws',
  configService: any,
): any {
  if (provider != null && provider.toLocaleLowerCase() === 'aws') {
    return new S3FileUploadProvider(configService);
  } else {
    return new CooudinaryFileUploadProvider(configService);
  }
}
