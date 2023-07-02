import { Field, ObjectType } from '@nestjs/graphql';

import { MutationError } from '~/errors/errors.errors';

@ObjectType()
export class MutationResult {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => MutationError, { nullable: true })
  error?: MutationError;
}
