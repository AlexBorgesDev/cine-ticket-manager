import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { capitalize } from '~/@global/utils';

@InputType()
export class CreateCategoryInput {
  @Field()
  @Length(2, 255)
  @Matches(/^[A-Za-zÀ-ÿ- ]+$/g)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => capitalize(value))
  name: string;
}
