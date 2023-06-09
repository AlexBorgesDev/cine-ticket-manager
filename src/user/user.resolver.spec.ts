import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRole } from './user.types';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService],
    }).compile();

    resolver = app.get<UserResolver>(UserResolver);
  });

  describe('signIn', () => {
    it('creates a new user correctly', async () => {
      const input = {
        name: faker.person.fullName(),
        email: faker.internet.email({ lastName: Date.now().toString() }),
        password: faker.internet.password({ length: 12 }),
      };

      const result = await resolver.signUp(input);

      expect(result).toEqual({
        success: true,
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
    });
  });
});
