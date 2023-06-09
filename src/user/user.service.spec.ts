import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { compareSync } from 'bcrypt';

import { MutationError } from '~/errors/errors.errors';

import { createUser } from './user.mock';
import { UserService } from './user.service';
import { UserRole } from './user.types';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = app.get<UserService>(UserService);
  });

  describe('create', () => {
    describe('when the user does not exist', () => {
      it('creates the user and returns it in an object', async () => {
        const input = {
          name: faker.person.fullName(),
          email: faker.internet.email({ lastName: Date.now().toString() }),
          password: faker.internet.password({ length: 12 }),
        };

        const result = await service.create(input);

        expect(result).toEqual({
          user: expect.objectContaining({
            id: expect.any(Number),
            uuid: expect.any(String),
            name: input.name,
            email: input.email,
            role: UserRole.USER,
            password: expect.not.stringMatching(input.password),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          }),
        });

        expect(compareSync(input.password, result.user.password)).toBe(true);
      });
    });

    describe('when the user already exists', () => {
      it('throws a MutationError with type USER_ALREADY_EXISTS', async () => {
        const password = faker.internet.password({ length: 12 });
        const existingUser = await createUser({ password });
        const input = { email: existingUser.email, name: existingUser.name, password };

        await expect(service.create(input)).rejects.toThrowError(new MutationError('USER_ALREADY_EXISTS'));
      });
    });
  });
});
