import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { instanceToPlain } from 'class-transformer';

import { Roles } from '~/auth/auth.decorators';

import { UploadFileDto } from './file.dto';
import { FileValidationPipe } from './file.pipes';
import { FileService } from './file.service';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('file/upload')
  @Roles(['ADMIN', 'EMPLOYER', 'SUPER_ADMIN'])
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(FileValidationPipe) file: any, @Body() data: UploadFileDto) {
    const result = await this.fileService.uploadFile(file, data);

    return { message: 'File uploaded successfully', file: instanceToPlain(result) };
  }
}
