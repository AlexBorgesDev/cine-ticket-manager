import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateDirectorResult } from './director.dto';
import { Director } from './director.entity';
import { CreateDirectorInput } from './director.input';

@Resolver()
export class DirectorResolver {
  @Mutation(() => CreateDirectorResult)
  async createDirector(@Args('input') input: CreateDirectorInput): Promise<CreateDirectorResult> {
    const director = await Director.create({ name: input.name }).save();

    return { success: !!director, director };
  }
}
