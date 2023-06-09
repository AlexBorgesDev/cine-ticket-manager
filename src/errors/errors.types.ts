import { HttpException, HttpStatus } from '@nestjs/common';

import { MutationResult } from '~/app.dto';

import { ErrorType } from './errors.constants';

export type ErrorTypeKey = ErrorType | keyof typeof ErrorType;

export type ErrorObjectType = {
  message: string;
  statusCode: number | HttpStatus;
  items?: string[];
  type: ErrorType;
};

export type CatchReturn = HttpException | (Omit<MutationResult, 'error'> & { error: ErrorObjectType });
