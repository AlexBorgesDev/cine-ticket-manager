import { HttpException, HttpStatus } from '@nestjs/common';

import { MutationResult } from '~/@global/dto';

import { ErrorType } from './errors.constants';

export type ErrorTypeKey = ErrorType | keyof typeof ErrorType;

export type ErrorObjectType = {
  code: number;
  message: string;
  statusCode: number | HttpStatus;
  items?: string[];
  type: ErrorType;
};

export type CatchReturn = HttpException | (Omit<MutationResult, 'error'> & { error: ErrorObjectType });
