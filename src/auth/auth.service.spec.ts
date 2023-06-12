import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { MutationError } from '~/errors/errors.errors';
import { createUser } from '~/user/user.mock';

import { createCredential } from './auth.mock';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const jwtService = { sign: jest.fn().mockReturnValue('any_token') };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: jwtService }],
    }).compile();

    service = app.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    describe('with valid credentials', () => {
      it('returns a JWT session token', async () => {
        const input = createCredential();
        await createUser(input);

        const result = await service.signIn(input);

        expect(result).toEqual({ accessToken: 'any_token', type: 'Bearer' });
      });
    });

    describe('with invalid credentials', () => {
      describe('when the user does not exist', () => {
        it('throws an error', async () => {
          const input = createCredential();
          await expect(service.signIn(input)).rejects.toThrowError(new MutationError('INVALID_CREDENTIAL'));
        });
      });

      describe('when the password does not match', () => {
        it('throws an error', async () => {
          const input = createCredential();
          await createUser(input);

          await expect(service.signIn({ ...input, password: '' })).rejects.toThrowError(
            new MutationError('INVALID_CREDENTIAL'),
          );
        });
      });
    });
  });
});
