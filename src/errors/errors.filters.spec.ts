import { BadRequestException, InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';

import { MutationError } from './errors.errors';
import { HttpExceptionFilter } from './errors.filters';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  const gqlHost = { getType: jest.fn().mockReturnValue('graphql') };

  const send = jest.fn();
  const response = { status: jest.fn().mockReturnValue({ send }) };
  const getResponse = jest.fn().mockReturnValue(response);
  const switchToHttp = jest.fn().mockReturnValue({ getResponse });

  beforeEach(() => {
    jest.spyOn(GqlArgumentsHost, 'create').mockReturnValue(<any>gqlHost);

    filter = new HttpExceptionFilter();
  });

  describe('catch', () => {
    describe('when host type is different from graphql', () => {
      describe('when it is of type MutationError', () => {
        it('returns the undefined and send http response', () => {
          gqlHost.getType.mockReturnValueOnce('http');

          const exception = new MutationError('FORBIDDEN');

          expect(filter.catch(exception, <any>{ switchToHttp })).toBeUndefined();
          expect(response.status).toBeCalledWith(exception.getStatus());
          expect(send).toBeCalledWith(exception.toObject());
        });
      });

      describe('when it is of type HttpException', () => {
        it('returns the undefined and send http response', () => {
          gqlHost.getType.mockReturnValueOnce('http');

          const exception = new BadRequestException('Test error');

          expect(filter.catch(exception, <any>{ switchToHttp })).toBeUndefined();
          expect(response.status).toBeCalledWith(exception.getStatus());
          expect(send).toBeCalledWith(exception.getResponse());
        });
      });

      describe('when it is an unhandled error', () => {
        it('returns the undefined and send http response with status 500', () => {
          gqlHost.getType.mockReturnValueOnce('http');

          const exception = new Error('Test error');

          expect(filter.catch(<any>exception, <any>{ switchToHttp })).toBeUndefined();
          expect(response.status).toBeCalledWith(500);
          expect(send).toBeCalledWith(new InternalServerErrorException().getResponse());
        });
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
