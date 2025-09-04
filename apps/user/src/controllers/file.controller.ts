import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import axios from 'axios';
import * as FormData from 'form-data';
import { ResponsesService } from '@app/utils/services/responses.service';
import { UtilsService } from '@app/utils';
import { FileUploadService } from '@app/utils/services/file-upload.service';
@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(
    private readonly responseService: ResponsesService,
    private readonly fileUploadService: FileUploadService,
  ) {}
  @Post()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.fileUploadService.uploadPicture(file);
      // const url = await this.cloudinaryUpload(file);
      return this.responseService.success(result);
    } catch (e) {
      return this.responseService.exception(e.message);
    }
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Files to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadFiles(@UploadedFiles() files?: { files?: any[] }) {
    try {
      const filesData = await Promise.all(
        files?.files.map(async (file) => {
          console.log(file);
          const url = await this.cloudinaryUpload(file);
          return url;
        }),
      );
      return this.responseService.success(filesData);
    } catch (e) {
      console.log(e.message);
      return this.responseService.exception(e.message);
    }
  }

  async cloudinaryUpload(file) {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, file.originalname);
      formData.append('upload_preset', process.env.CLOUD_UPLOAD_PRESET);
      formData.append('cloud_name', process.env.CLOUD_NAME);

      const response = await axios.post(
        `${process.env.CLOUDINARY_BASEURL}${process.env.CLOUD_NAME}/image/upload`,
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
}
