import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Test, TestingModule } from '@nestjs/testing';

import { S3ServiceMock } from '~/aws/aws.mock';
import { S3Service } from '~/aws/s3.service';

import { File } from './file.entity';
import { FileService } from './file.service';
import { FileCategory } from './file.types';

jest.mock('@aws-sdk/client-s3');

describe('FileService', () => {
  let service: FileService;

  const s3Service = S3ServiceMock();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [FileService, { provide: S3Service, useValue: s3Service }],
    }).compile();

    service = app.get<FileService>(FileService);
  });

  describe('uploadFile', () => {
    it('uploads to s3 and creates the database record correctly ', async () => {
      const file = <Express.Multer.File>{
        size: 3000,
        buffer: Buffer.from([]),
        originalname: 'test.png',
        mimetype: 'image/png',
      };

      const result = await service.uploadFile(file, { category: FileCategory.BANNER, alt: 'Test image upload' });

      expect(result).toBeInstanceOf(File);
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          alt: 'Test image upload',
          bucket: s3Service.bucket,
          category: FileCategory.BANNER,
          filename: expect.stringContaining(file.originalname),
          mimetype: file.mimetype,
          state: 'PENDING_OPTIMIZATION',
          size: file.size,
          uuid: expect.any(String),
        }),
      );

      expect(s3Service.send).toBeCalledTimes(1);
      expect(PutObjectCommand).toBeCalledWith(
        expect.objectContaining({
          ACL: 'public-read',
          Bucket: s3Service.bucket,
          Key: expect.stringContaining(file.originalname),
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    });
  });
});
