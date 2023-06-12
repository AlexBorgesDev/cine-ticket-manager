import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { MutationError } from '~/errors/errors.errors';
import { createUser } from '~/user/user.mock';

import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const configService = { get: jest.fn().mockReturnValue('any_secret') };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy, { provide: ConfigService, useValue: configService }],
    }).compile();

    strategy = app.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    describe('when the user exists', () => {
      it('returns the user', async () => {
        const user = await createUser();
        const result = await strategy.validate({ sub: user.uuid });

        expect(result).toEqual(user);
      });
    });

    describe('when the user does not exist', () => {
      it('throws an UNAUTHORIZED error', async () => {
        await expect(strategy.validate({ sub: 'any_uuid' })).rejects.toThrowError(new MutationError('UNAUTHORIZED'));
      });
    });
  });
});
