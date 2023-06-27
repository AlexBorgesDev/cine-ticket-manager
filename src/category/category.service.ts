import { MutationError } from '~/errors/errors.errors';

import { Category } from './category.entity';
import { CreateCategoryInput } from './category.input';

export class CategoryService {
  async create({ name }: CreateCategoryInput) {
    const alreadyExists = await Category.findOneBy({ name });

    if (alreadyExists) throw new MutationError('CATEGORY_ALREADY_EXISTS');

    const category = Category.create({ name });
    await category.save();

    return category;
  }
}
