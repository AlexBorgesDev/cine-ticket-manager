import { Field, ObjectType } from '@nestjs/graphql';

import { MutationResult } from '~/@global/dto';

import { Director } from './director.entity';

@ObjectType()
export class CreateDirectorResult extends MutationResult {
  @Field({ nullable: true })
  director?: Director;
}
