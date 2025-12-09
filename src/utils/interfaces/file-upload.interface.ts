export interface FileUploadProvider {
  upload(file: Express.Multer.File): Promise<UploadedFileDto>;
}

export interface UploadedFileDto {
  name: string;
  url: string;
}
