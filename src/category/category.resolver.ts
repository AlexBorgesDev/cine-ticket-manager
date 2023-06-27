import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateCategoryResult } from './category.dto';
import { Category } from './category.entity';
import { CreateCategoryInput } from './category.input';
import { CategoryService } from './category.service';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => CreateCategoryResult)
  async createCategory(@Args('input') input: CreateCategoryInput): Promise<CreateCategoryResult> {
    const category = await this.categoryService.create(input);

    return { success: !!category, category };
  }
}
