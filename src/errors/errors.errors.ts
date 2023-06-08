import { HttpException, HttpStatus } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ErrorType, errors } from './errors.constants';
import { ErrorObjectType, ErrorTypeKey } from './errors.types';

@ObjectType()
export class MutationError extends HttpException implements ErrorObjectType {
  @Field(() => Int, { description: 'A unique code assigned to the error' })
  readonly code: number;

  @Field({ description: 'Short message describing the error' })
  readonly message: string;

  @Field(() => Int, { description: 'HTTP status code' })
  readonly statusCode: number | HttpStatus;

  @Field(() => [String], { nullable: true })
  readonly items?: string[];

  @Field(() => ErrorType)
  readonly type: ErrorType;

  constructor(type: ErrorTypeKey, items?: string[]) {
    const error = errors[type];

    super(error.message, error.statusCode);

    this.code = error.code;
    this.message = error.message;
    this.statusCode = error.statusCode;
    this.items = error.items || items;
    this.type = error.type;
  }

  toObject(): ErrorObjectType {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      items: this.items,
      type: this.type,
    };
  }
}
