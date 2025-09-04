import { WorkerHostProcessor } from '@app/queue/processor/worker-host.processor';
import { Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { FileUploadService } from '@app/utils/services/file-upload.service';
import { PrismaClient } from '@prisma/client';

@Processor('FILE')
@Injectable()
export class FileProcessor extends WorkerHostProcessor {
  prisma = new PrismaClient();
  constructor(private readonly service: FileUploadService) {
    super();
  }
  async process(job: Job<FileJobDto, any, string>): Promise<any> {
    const { data } = job;
    const result = await this.service.uploadPicture(data.file);
    const payload: any = {
      userId: data.userId,
      // fileType: data.fileType,
      fileUrl: result.url,
    };

    console.log(payload);
    return {};
  }
}

export interface FileJobDto {
  file: Express.Multer.File;
  userId: string;
  // fileType: FileToUpload;
}
