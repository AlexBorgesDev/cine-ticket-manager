import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { MutationError } from '~/errors/errors.errors';
import { UserRole } from '~/user/user.types';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const executionContext = {
    getHandler: jest.fn().mockReturnValue(jest.fn),
  } as unknown as ExecutionContext;

  const reflector = { get: jest.fn().mockReturnValue([UserRole.ADMIN, UserRole.EMPLOYER, UserRole.SUPER_ADMIN]) };

  const gqlHost = {
    getContext: jest.fn().mockReturnValue({ req: { user: { role: UserRole.USER } } }),
    getHandler: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(<any>gqlHost);

    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, { provide: Reflector, useValue: reflector }],
    }).compile();

    guard = app.get<AuthGuard>(AuthGuard);
  });

  describe('canActivate', () => {
    describe('when there are roles', () => {
      describe('when the user has the necessary privileges', () => {
        it('returns true', () => {
          gqlHost.getContext.mockReturnValueOnce({ req: { user: { role: UserRole.ADMIN } } });

          expect(guard.canActivate(executionContext)).toBe(true);
        });
      });

      describe('when the user does not have the necessary privileges', () => {
        it('throws a MutationError of type FORBIDDEN', async () => {
          await expect(async () => guard.canActivate(executionContext)).rejects.toThrowError(
            new MutationError('FORBIDDEN'),
          );
        });
      });
    });

    describe('when there are no roles', () => {
      it('returns true', () => {
        reflector.get.mockReturnValueOnce(null);

        expect(guard.canActivate(executionContext)).toBe(true);
      });
    });
  });
});
