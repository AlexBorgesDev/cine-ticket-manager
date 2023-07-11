import { Test, TestingModule } from '@nestjs/testing';

import { S3ServiceMock } from '~/aws/aws.mock';
import { S3Service } from '~/aws/s3.service';

import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileCategory } from './file.types';

describe('FileController', () => {
  let controller: FileController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [FileService, { provide: S3Service, useValue: S3ServiceMock() }],
    }).compile();

    controller = app.get<FileController>(FileController);
  });

  describe('uploadFile', () => {
    it('returns uploaded file correctly', async () => {
      const file = <Express.Multer.File>{
        size: 3000,
        buffer: Buffer.from([]),
        originalname: 'test.png',
        mimetype: 'image/png',
      };

      const result = await controller.uploadFile(file, { category: FileCategory.BANNER });

      expect(result).toEqual({
        message: 'File uploaded successfully',
        file: expect.objectContaining({
          alt: null,
          size: file.size,
          state: 'PENDING_OPTIMIZATION',
          bucket: 'test',
          filename: expect.stringContaining(file.originalname),
          mimetype: file.mimetype,
          category: FileCategory.BANNER,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      });
    });
  });
});
