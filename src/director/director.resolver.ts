import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { Roles } from '~/auth/auth.decorators';

import { CreateDirectorResult } from './director.dto';
import { Director } from './director.entity';
import { CreateDirectorInput } from './director.input';

@Resolver()
export class DirectorResolver {
  @Roles(['ADMIN', 'EMPLOYER', 'SUPER_ADMIN'])
  @Mutation(() => CreateDirectorResult)
  async createDirector(@Args('input') input: CreateDirectorInput): Promise<CreateDirectorResult> {
    const director = await Director.create({ name: input.name }).save();

    return { success: !!director, director };
  }
}
