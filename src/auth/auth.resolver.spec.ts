import { Test, TestingModule } from '@nestjs/testing';

import { createCredential } from './auth.mock';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const authService = {
    signIn: jest.fn().mockResolvedValue({ accessToken: 'any_token' }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthResolver, { provide: AuthService, useValue: authService }],
    }).compile();

    resolver = app.get<AuthResolver>(AuthResolver);
  });

  describe('signIn', () => {
    describe('with valid credentials', () => {
      it('returns a JWT session token', async () => {
        const result = await resolver.signIn(createCredential());

        expect(result).toEqual({ accessToken: 'any_token', success: true });
      });
    });
  });
});
