import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

@InputType()
export class CreateDirectorInput {
  @Field()
  @Length(2, 255)
  @Matches(/^[A-Za-zÀ-ÿ ]+$/g)
  @IsString()
  @IsNotEmpty()
  name: string;
}
