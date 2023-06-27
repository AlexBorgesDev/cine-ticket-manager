import { Test, TestingModule } from '@nestjs/testing';

import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';

describe('CategoryResolver', () => {
  let resolver: CategoryResolver;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CategoryResolver, CategoryService],
    }).compile();

    resolver = app.get<CategoryResolver>(CategoryResolver);
  });

  describe('createCategory', () => {
    it('creates the new category correctly', async () => {
      const result = await resolver.createCategory({ name: 'drama' });

      expect(result).toEqual({
        success: true,
        category: expect.objectContaining({
          id: expect.any(Number),
          name: 'Drama',
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      });
    });
  });
});
