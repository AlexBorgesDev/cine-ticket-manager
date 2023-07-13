import * as path from 'path';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AWSModule } from '~/aws/aws.module';
import { FileModule } from '~/file/file.module';
import { UserRole } from '~/user/user.types';

import { BaseE2eModule, e2eUserAndAccessToken } from './jest-e2e.utils';

describe('FileController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  const filename = 'jest-e2e.util.jpg';
  const filePath = path.resolve(__dirname, filename);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BaseE2eModule, AWSModule, FileModule],
    }).compile();

    app = moduleRef.createNestApplication({ logger: false });
    await app.init();

    accessToken = (await e2eUserAndAccessToken(app, { role: UserRole.ADMIN })).accessToken;
  });

  describe('/file/upload (POST) - uploadFile', () => {
    describe('with invalid input', () => {
      describe('when the user does not have enough privileges', () => {
        it('returns with status code 403', async () => {
          const invalidSession = await e2eUserAndAccessToken(app);

          const res = await request(app.getHttpServer())
            .post('/file/upload')
            .set('Authorization', `Bearer ${invalidSession.accessToken}`)
            .field('category', 'BANNER')
            .attach('file', filePath, { filename })
            .expect(403);

          expect(res.body).toEqual({
            message: 'User without the required privileges',
            statusCode: 403,
            type: 'FORBIDDEN',
          });
        });
      });

      describe('when file type is invalid', () => {
        it('returns with status code 422', async () => {
          const filename = 'jest-e2e.utils.ts';
          const filePath = path.resolve(__dirname, filename);

          const res = await request(app.getHttpServer())
            .post('/file/upload')
            .set('Authorization', `Bearer ${accessToken}`)
            .field('category', 'BANNER')
            .attach('file', filePath, { filename })
            .expect(422);

          expect(res.body).toEqual({
            items: ['Only items of the type are allowed: (jpeg|pjpeg|png|webp|avi|mp4|mkv|webm)'],
            message: 'Invalid file type',
            statusCode: 422,
            type: 'INVALID_FILE_TYPE',
          });
        });
      });
    });

    describe('with valid input', () => {
      it('returns the file data with status code 201', async () => {
        const res = await request(app.getHttpServer())
          .post('/file/upload')
          .set('Authorization', `Bearer ${accessToken}`)
          .field('category', 'BANNER')
          .field('alt', 'Test image')
          .attach('file', filePath, { filename })
          .expect(201);

        expect(res.body).toEqual({
          message: 'File uploaded successfully',
          file: expect.objectContaining({
            alt: 'Test image',
            bucket: expect.any(String),
            category: 'BANNER',
            createdAt: expect.any(String),
            filename: expect.stringContaining(filename),
            mimetype: 'image/jpeg',
            size: expect.any(Number),
            state: 'PENDING_OPTIMIZATION',
            updatedAt: expect.any(String),
            uuid: expect.any(String),
          }),
        });
      });
    });
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});
