import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { v4 as uuid } from 'uuid';

import { capitalize } from '~/app.utils';
import { Category } from '~/category/category.entity';
import { CreateCategoryInput } from '~/category/category.input';
import { CategoryModule } from '~/category/category.module';
import { UserRole } from '~/user/user.types';

import { categoryMutations } from './graphql/category-e2e.graphql';
import { BaseE2eModule, e2eUserAndAccessToken } from './jest-e2e.utils';

describe('CategoryResolver (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BaseE2eModule, CategoryModule],
    }).compile();

    app = moduleRef.createNestApplication({ logger: false });
    await app.init();

    accessToken = (await e2eUserAndAccessToken(app, { role: UserRole.ADMIN })).accessToken;
  });

  describe('createCategory (mutation)', () => {
    const createCategoryMutation = (input?: Partial<CreateCategoryInput>) => {
      return {
        operationName: 'createCategory',
        query: categoryMutations.createCategory,
        variables: {
          input: { name: faker.lorem.words({ min: 1, max: 5 }), ...input },
        },
      };
    };

    describe('with invalid input', () => {
      it('returns success as false and an error of type INVALID_INPUT', async () => {
        const res = await request(app.getHttpServer())
          .post('/graphql')
          .send(createCategoryMutation({ name: '' }))
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(res.body).toEqual({
          data: {
            createCategory: {
              success: false,
              category: null,
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
      describe('when the user has enough privileges', () => {
        it('returns success as true and the category', async () => {
          const mutation = createCategoryMutation();
          const input = mutation.variables.input;

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .send(mutation)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

          expect(res.body).toEqual({
            data: {
              createCategory: {
                success: true,
                category: expect.objectContaining({
                  name: capitalize(input.name),
                  uuid: expect.any(String),
                  createdAt: expect.any(String),
                  updatedAt: expect.any(String),
                }),
                error: null,
              },
            },
          });
        });

        describe('when a category with the same name already exists', () => {
          it('returns success as false and an error of type CATEGORY_ALREADY_EXISTS', async () => {
            const category = Category.create({ name: faker.lorem.words({ min: 2, max: 10 }), uuid: uuid() });
            await category.save({ listeners: false });

            const res = await request(app.getHttpServer())
              .post('/graphql')
              .send(createCategoryMutation({ name: category.name }))
              .set('Authorization', `Bearer ${accessToken}`)
              .expect(200);

            expect(res.body).toEqual({
              data: {
                createCategory: {
                  success: false,
                  category: null,
                  error: expect.objectContaining({
                    items: null,
                    message: 'Category already exists',
                    statusCode: 422,
                    type: 'CATEGORY_ALREADY_EXISTS',
                  }),
                },
              },
            });
          });
        });
      });

      describe('when the user does not have enough privileges', () => {
        it('returns success as false and an error of type FORBIDDEN', async () => {
          const invalidSession = await e2eUserAndAccessToken(app);

          const res = await request(app.getHttpServer())
            .post('/graphql')
            .send(createCategoryMutation())
            .set('Authorization', `Bearer ${invalidSession.accessToken}`)
            .expect(200);

          expect(res.body).toEqual({
            data: {
              createCategory: {
                success: false,
                category: null,
                error: expect.objectContaining({
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
