import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { S3Service } from '~/aws/s3.service';

import { UploadFileDto } from './file.dto';
import { File } from './file.entity';

@Injectable()
export class FileService {
  constructor(private readonly S3: S3Service) {}

  async uploadFile(file: Express.Multer.File, data: UploadFileDto) {
    const filename = `${Date.now()}-${file.originalname}`;

    await this.S3.send(
      new PutObjectCommand({
        ACL: 'public-read',
        Bucket: this.S3.bucket,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return await File.create({
      alt: data.alt,
      bucket: this.S3.bucket,
      category: data.category,
      filename,
      mimetype: file.mimetype,
      size: file.size,
    }).save();
  }
}
