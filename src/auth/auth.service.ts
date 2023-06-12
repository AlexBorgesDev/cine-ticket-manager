import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { MutationError } from '~/errors/errors.errors';
import { User } from '~/user/user.entity';

import { SignInInput } from './auth.input';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signIn({ email, password }: SignInInput) {
    const user = await User.findOneBy({ email });
    const matchesPassword = await compare(password, user?.password || '');

    if (!matchesPassword) throw new MutationError('INVALID_CREDENTIAL');

    return { accessToken: this.jwtService.sign({ sub: user.uuid }) };
  }
}
