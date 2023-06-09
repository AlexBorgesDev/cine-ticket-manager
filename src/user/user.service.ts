import { Injectable } from '@nestjs/common';

import { MutationError } from '~/errors/errors.errors';

import { User } from './user.entity';
import { SignUpInput } from './user.input';

@Injectable()
export class UserService {
  async create({ email, name, password }: SignUpInput) {
    const alreadyExists = await User.findOneBy({ email });

    if (alreadyExists) throw new MutationError('USER_ALREADY_EXISTS');

    const user = User.create({ email, name, password });
    await user.save();

    return { user };
  }
}
