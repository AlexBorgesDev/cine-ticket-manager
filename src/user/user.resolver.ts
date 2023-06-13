import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUser, Public } from '~/auth/auth.decorators';

import { SignUpResult } from './user.dto';
import { User } from './user.entity';
import { SignUpInput } from './user.input';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  user(@CurrentUser() user: User) {
    return user;
  }

  @Public()
  @Mutation(() => SignUpResult)
  async signUp(@Args('input') input: SignUpInput): Promise<SignUpResult> {
    const { user } = await this.userService.create(input);

    return { success: !!user, user };
  }
}
