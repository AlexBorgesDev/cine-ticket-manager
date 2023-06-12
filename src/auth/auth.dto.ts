import { Field, ObjectType } from '@nestjs/graphql';

import { MutationResult } from '~/@global/dto';

@ObjectType()
export class SignInResult extends MutationResult {
  @Field({ nullable: true })
  accessToken?: string;
}
