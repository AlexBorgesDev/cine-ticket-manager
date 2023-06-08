import { Field, ObjectType } from '@nestjs/graphql';

import { MutationResult } from '~/@global/dto';

import { User } from './user.entity';

@ObjectType()
export class SignUpResult extends MutationResult {
  @Field({ nullable: true })
  user?: User;
}
