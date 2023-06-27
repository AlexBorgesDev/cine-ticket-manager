import { Field, ObjectType } from '@nestjs/graphql';

import { MutationResult } from '~/@global/dto';

import { Category } from './category.entity';

@ObjectType()
export class CreateCategoryResult extends MutationResult {
  @Field({ nullable: true })
  category?: Category;
}
