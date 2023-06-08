import { HttpStatus } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

import { ErrorObjectType } from './errors.types';

export enum ErrorType {
  INVALID_CREDENTIAL = 'INVALID_CREDENTIAL',
  INVALID_INPUT = 'INVALID_INPUT',
  MEMBER_ALREADY_EXISTS = 'MEMBER_ALREADY_EXISTS',
  UNAUTHORIZED = 'UNAUTHORIZED',
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
  MEMBER_ALREADY_EXISTS: {
    code: 2002,
    message: 'Member already exists',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    type: ErrorType.MEMBER_ALREADY_EXISTS,
  },
  UNAUTHORIZED: {
    code: 4001,
    message: 'Unauthorized action',
    statusCode: HttpStatus.UNAUTHORIZED,
    type: ErrorType.UNAUTHORIZED,
  },
};

registerEnumType(ErrorType, {
  name: 'ErrorType',
  description: 'All kinds of expected errors',
});
