import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { SignInInput } from '~/auth/auth.input';
import { User } from '~/user/user.entity';
import { createUser } from '~/user/user.mock';

import { authMutations } from './graphql/auth-e2e.graphql';
import { BaseE2eModule } from './jest-e2e.utils';

describe('AuthResolver (e2e)', () => {
  let app: INestApplication;

  let userTest: User;
  const userTestPassword = faker.internet.password({ length: 12 });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BaseE2eModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userTest = await createUser({ password: userTestPassword });
  });

  describe('signIn (mutation)', () => {
    const signInMutation = (input?: Partial<SignInInput>) => {
      return {
        operationName: 'signIn',
        query: authMutations.signIn,
        variables: {
          input: {
            email: userTest.email,
            password: userTestPassword,
            ...input,
          },
        },
      };
    };

    describe('with invalid input', () => {
      it('returns success as false and an error of type INVALID_INPUT', async () => {
        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send(signInMutation({ email: '' }))
          .expect(200);

        expect(res.body).toEqual({
          data: {
            signIn: {
              success: false,
              accessToken: null,
              error: expect.objectContaining({
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
      describe('with valid credentials', () => {
        it('returns success as true and the access token', async () => {
          const res = await request(app.getHttpServer()).post('/graphql').send(signInMutation()).expect(200);

          expect(res.body).toEqual({
            data: {
              signIn: {
                success: true,
                accessToken: expect.any(String),
                error: null,
              },
            },
          });
        });
      });

      describe('when the user does not exist', () => {
        it('returns success as false and an error of type INVALID_CREDENTIAL', async () => {
          const res = await request(app.getHttpServer())
            .post('/graphql')
            .send(signInMutation({ email: faker.internet.email({ lastName: Date.now().toString() }) }))
            .expect(200);

          expect(res.body).toEqual({
            data: {
              signIn: {
                success: false,
                accessToken: null,
                error: expect.objectContaining({
                  items: null,
                  message: 'Invalid email or password',
                  statusCode: 422,
                  type: 'INVALID_CREDENTIAL',
                }),
              },
            },
          });
        });
      });

      describe('when the password is incorrect', () => {
        it('returns success as false and an error of type INVALID_CREDENTIAL', async () => {
          const res = await request(app.getHttpServer())
            .post('/graphql')
            .send(signInMutation({ password: '012345678' }))
            .expect(200);

          expect(res.body).toEqual({
            data: {
              signIn: {
                success: false,
                accessToken: null,
                error: expect.objectContaining({
                  items: null,
                  message: 'Invalid email or password',
                  statusCode: 422,
                  type: 'INVALID_CREDENTIAL',
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
