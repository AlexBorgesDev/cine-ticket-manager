import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtAuthGuard } from './jwt-auth.guard';

const superCanActivateMock = jest.fn().mockReturnValue(true);

jest.mock('@nestjs/passport', () => {
  const originalModule = jest.requireActual('@nestjs/passport');

  return {
    ...originalModule,
    AuthGuard: () => {
      return class AuthGuardMock {
        canActivate(context: ExecutionContext) {
          return superCanActivateMock(context);
        }
      };
    },
  };
});

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const executionContext = {
    getHandler: jest.fn().mockReturnValue(jest.fn),
    getClass: jest.fn().mockReturnValue('graphql'),
  } as unknown as ExecutionContext;

  const reflector = { getAllAndOverride: jest.fn().mockReturnValue(true) };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard, { provide: Reflector, useValue: reflector }],
    }).compile();

    guard = app.get<JwtAuthGuard>(JwtAuthGuard);
  });

  describe('canActivate', () => {
    describe('when it is public', () => {
      it('returns true', () => {
        const result = guard.canActivate(executionContext);

        expect(result).toBe(true);
      });
    });

    describe('when it is not public', () => {
      it('calls super.canActivate and returns true', () => {
        reflector.getAllAndOverride.mockReturnValueOnce(false);

        const result = guard.canActivate(executionContext);

        expect(result).toBe(true);
        expect(superCanActivateMock).toBeCalledWith(executionContext);
      });
    });
  });

  describe('getRequest', () => {
    it('returns request', () => {
      const gqlCreateMock = jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(<any>{
        getContext: jest.fn().mockReturnValue({ req: { headers: {} } }),
      });

      const result = guard.getRequest(executionContext);

      expect(result).toEqual({ headers: {} });
      expect(gqlCreateMock).toBeCalledWith(executionContext);
    });
  });
});
