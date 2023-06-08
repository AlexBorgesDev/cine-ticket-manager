import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @Length(2, 255)
  @Matches(/^[a-zA-ZÀ-ÿ]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @Length(8, 24)
  @IsString()
  @IsNotEmpty()
  password: string;
}
