import { ArgumentsHost, Catch, HttpException, ValidationPipe } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

import { MutationError } from './errors.errors';
import { CatchReturn } from './errors.types';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): CatchReturn {
    const gqlHost = GqlArgumentsHost.create(host);

    if (gqlHost.getType<any>() !== 'graphql') return exception;

    if (exception instanceof MutationError) {
      return { success: false, error: exception.toObject() };
    }

    if (exception.stack.includes(ValidationPipe.name)) {
      const res = exception.getResponse();

      return {
        success: false,
        error: new MutationError('INVALID_INPUT', typeof res === 'string' ? [res] : res['message']).toObject(),
      };
    }

    return exception;
  }
}
