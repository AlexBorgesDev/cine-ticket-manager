import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { Public } from './auth.decorators';
import { SignInResult } from './auth.dto';
import { SignInInput } from './auth.input';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignInResult)
  async signIn(@Args('input') input: SignInInput): Promise<SignInResult> {
    const { accessToken } = await this.authService.signIn(input);

    return { accessToken, success: !!accessToken };
  }
}
