import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AuthService } from '~/auth/auth.service';
import { CreateDirectorInput } from '~/director/director.input';
import { DirectorModule } from '~/director/director.module';
import { User } from '~/user/user.entity';
import { createUser } from '~/user/user.mock';
import { UserRole } from '~/user/user.types';

import { directorMutations } from './graphql/director-e2e.graphql';
import { BaseE2eModule } from './jest-e2e.utils';

describe('DirectorResolver (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  let userTest: User;
  let accessToken: string;
  const userTestPassword = faker.internet.password({ length: 12 });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BaseE2eModule, DirectorModule],
    }).compile();

    app = moduleRef.createNestApplication({ logger: false });
    await app.init();

    authService = app.get<AuthService>(AuthService);

    userTest = await createUser({ password: userTestPassword, role: UserRole.ADMIN });
    accessToken = (await authService.signIn({ email: userTest.email, password: userTestPassword })).accessToken;
  });

  describe('createDirector (mutation)', () => {
    const createDirectorMutation = (input?: Partial<CreateDirectorInput>) => {
      return {
        operationName: 'createDirector',
        query: directorMutations.createDirector,
        variables: {
          input: { name: 'Director name', ...input },
        },
      };
    };

    describe('with invalid input', () => {
      it('returns success as false and an error of type INVALID_INPUT', async () => {
        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send(createDirectorMutation({ name: '' }))
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(res.body).toEqual({
          data: {
            createDirector: {
              success: false,
              director: null,
              error: expect.objectContaining({
                code: 1001,
                items: expect.any(Array),
                message: 'Invalid inputs',
                statusCode: 400,
                type: 'INVALID_INPUT',
              }),
            },
          },
        });
      });
    });

    describe('with valid input', () => {
      describe('when the user has enough privileges', () => {
        it('returns success as true and the director', async () => {
          const mutation = createDirectorMutation();
          const input = mutation.variables.input;

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .send(mutation)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

          expect(res.body).toEqual({
            data: {
              createDirector: {
                success: true,
                director: expect.objectContaining({ name: input.name }),
                error: null,
              },
            },
          });
        });
      });

      describe('when the user does not have enough privileges', () => {
        it('returns success as false and an error of type FORBIDDEN', async () => {
          const password = faker.internet.password({ length: 12 });
          const user = await createUser({ password });
          const token = await authService.signIn({ email: user.email, password });

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .send(createDirectorMutation())
            .set('Authorization', `Bearer ${token.accessToken}`)
            .expect(200);

          expect(res.body).toEqual({
            data: {
              createDirector: {
                success: false,
                director: null,
                error: expect.objectContaining({
                  code: 4003,
                  items: null,
                  message: 'User without the required privileges',
                  statusCode: 403,
                  type: 'FORBIDDEN',
                }),
              },
            },
          });
        });
      });
    });
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});
