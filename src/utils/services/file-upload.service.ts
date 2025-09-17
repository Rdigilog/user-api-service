import { Inject, Injectable } from '@nestjs/common';
import * as fileUploadInterface from '../interfaces/file-upload.interface';
// import { FileUploadProvider } from './file-upload.interface';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject('FileUploadProvider')
    private fileUploadProvider: fileUploadInterface.FileUploadProvider,
  ) {}

  async uploadPicture(file: Express.Multer.File) {
    return await this.fileUploadProvider.upload(file);
  }
}
