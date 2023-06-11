import { HttpStatus } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

import { ErrorObjectType } from './errors.types';

export enum ErrorType {
  INVALID_CREDENTIAL = 'INVALID_CREDENTIAL',
  INVALID_INPUT = 'INVALID_INPUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
}

export const errors: Record<ErrorType, ErrorObjectType> = {
  INVALID_CREDENTIAL: {
    code: 4012,
    message: 'Invalid email or password',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    type: ErrorType.INVALID_CREDENTIAL,
  },
  INVALID_INPUT: {
    code: 1001,
    message: 'Invalid inputs',
    statusCode: HttpStatus.BAD_REQUEST,
    type: ErrorType.INVALID_INPUT,
  },
  UNAUTHORIZED: {
    code: 4001,
    message: 'Unauthorized action',
    statusCode: HttpStatus.UNAUTHORIZED,
    type: ErrorType.UNAUTHORIZED,
  },
  USER_ALREADY_EXISTS: {
    code: 2002,
    message: 'User already exists',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    type: ErrorType.USER_ALREADY_EXISTS,
  },
};

registerEnumType(ErrorType, {
  name: 'ErrorType',
  description: 'All kinds of expected errors',
});
