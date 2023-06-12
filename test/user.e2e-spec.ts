import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { SignUpInput } from '~/user/user.input';
import { createUser } from '~/user/user.mock';
import { UserModule } from '~/user/user.module';

import { userMutations } from './graphql/user-e2e.graphql';
import { BaseE2eModule } from './jest-e2e.utils';

describe('UserResolver (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BaseE2eModule, UserModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('signUp (mutation)', () => {
    const signUpMutation = (input?: Partial<SignUpInput>) => {
      return {
        operationName: 'signUp',
        query: userMutations.signUp,
        variables: {
          input: {
            name: 'User Test',
            email: faker.internet.email({ lastName: Date.now().toString() }),
            password: faker.internet.password({ length: 12 }),
            ...input,
          },
        },
      };
    };

    describe('with invalid input', () => {
      it('returns success as false and an error of type INVALID_INPUT', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send(signUpMutation({ email: '' }))
          .expect(200)
          .expect((res) => {
            expect(res.body).toEqual({
              data: {
                signUp: {
                  success: false,
                  user: null,
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
    });

    describe('with valid input', () => {
      describe('when the email is already used by another user', () => {
        it('returns success as false and an error of type USER_ALREADY_EXISTS', async () => {
          const email = faker.internet.email({ lastName: Date.now().toString() });
          await createUser({ email });

          return request(app.getHttpServer())
            .post('/graphql')
            .send(signUpMutation({ email }))
            .expect(200)
            .expect((res) => {
              expect(res.body).toEqual({
                data: {
                  signUp: {
                    success: false,
                    user: null,
                    error: expect.objectContaining({
                      code: 2002,
                      items: null,
                      message: 'User already exists',
                      statusCode: 422,
                      type: 'USER_ALREADY_EXISTS',
                    }),
                  },
                },
              });
            });
        });
      });

      describe('when the email is not being used by another user', () => {
        it('returns success as true and the user created', () => {
          const mutation = signUpMutation();
          const input = mutation.variables.input;

          return request(app.getHttpServer())
            .post('/graphql')
            .send(mutation)
            .expect(200)
            .expect((res) => {
              expect(res.body).toEqual({
                data: {
                  signUp: {
                    success: true,
                    user: expect.objectContaining({
                      email: input.email,
                      name: input.name,
                      role: 'USER',
                      isAdmin: false,
                      isEmployer: false,
                      isSuperAdmin: false,
                      uuid: expect.any(String),
                      createdAt: expect.any(String),
                      updatedAt: expect.any(String),
                    }),
                    error: null,
                  },
                },
              });

              expect(Date.parse(res.body.data.signUp.user.createdAt)).not.toBeNaN();
              expect(Date.parse(res.body.data.signUp.user.updatedAt)).not.toBeNaN();
            });
        });
      });
    });
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});