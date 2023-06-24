import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

import { MutationError } from './errors.errors';
import { HttpExceptionFilter } from './errors.filters';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  const gqlHost = { getType: jest.fn().mockReturnValue('graphql') };

  beforeEach(() => {
    jest.spyOn(GqlArgumentsHost, 'create').mockReturnValue(<any>gqlHost);

    filter = new HttpExceptionFilter();
  });

  describe('catch', () => {
    describe('when host type is different from graphql', () => {
      it('returns the exception', () => {
        gqlHost.getType.mockReturnValueOnce('http');

        const exception = new BadRequestException('Test error');

        expect(filter.catch(exception, <any>{})).toEqual(exception);
      });
    });

    describe('when the exception is an instance of MutationError', () => {
      it('returns an object with success value as false and the error', () => {
        const exception = new MutationError('UNAUTHORIZED');

        expect(filter.catch(exception, <any>{})).toEqual({ success: false, error: exception.toObject() });
      });
    });

    describe('when the exception is an instance of ValidationPipe', () => {
      it('returns an object with success value as false and the error', () => {
        const exception = new ValidationPipe().createExceptionFactory()([]) as BadRequestException;
        exception.stack = `${exception.stack}\n${ValidationPipe.name}`;

        expect(filter.catch(<any>exception, <any>{})).toEqual({
          success: false,
          error: new MutationError('INVALID_INPUT', []).toObject(),
        });
      });
    });

    describe('when there is no treatment', () => {
      it('returns the exception', () => {
        const exception = new BadRequestException('Test error');

        expect(filter.catch(exception, <any>{})).toEqual(exception);
      });
    });
  });
});
