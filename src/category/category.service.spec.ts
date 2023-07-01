import { Test, TestingModule } from '@nestjs/testing';

import { MutationError } from '~/errors/errors.errors';
import { UserRole } from '~/user/user.types';
import { getCurrentUser } from '~/user/user.utils';

import { Category } from './category.entity';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CategoryService],
    }).compile();

    service = app.get<CategoryService>(CategoryService);
  });

  describe('create', () => {
    describe('when the user has the necessary privileges', () => {
      it('creates the new category correctly', async () => {
        const result = await service.create({ name: 'action' });

        expect(result).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: 'Action',
            uuid: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          }),
        );
      });

      describe('when a category with the same name already exists', () => {
        it('throws a MutationError', async () => {
          const category = await Category.create({ name: 'sci-fi' }).save();

          await expect(service.create({ name: category.name })).rejects.toThrowError(
            new MutationError('CATEGORY_ALREADY_EXISTS'),
          );
        });
      });
    });

    describe('when the user does not have the necessary privileges', () => {
      it('throws a MutationError', async () => {
        (getCurrentUser as jest.Mock).mockReturnValueOnce({ role: UserRole.USER });

        await expect(service.create({ name: 'adventure' })).rejects.toThrowError(new MutationError('FORBIDDEN'));
      });
    });
  });
});
