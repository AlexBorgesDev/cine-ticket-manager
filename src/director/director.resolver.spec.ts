import { Test, TestingModule } from '@nestjs/testing';

import { MutationError } from '~/errors/errors.errors';

import { DirectorResolver } from './director.resolver';

describe('DirectorResolver', () => {
  let resolver: DirectorResolver;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [DirectorResolver],
    }).compile();

    resolver = app.get<DirectorResolver>(DirectorResolver);
  });

  describe('createDirector', () => {
    describe('with invalid data', () => {
      it('throws a MutationError with type INVALID_INPUT', async () => {
        await expect(resolver.createDirector({ name: '' })).rejects.toThrowError(new MutationError('INVALID_INPUT'));
      });
    });

    describe('with valid data', () => {
      it('creates a new director correctly', async () => {
        const name = 'Director Name Test Success';
        const result = await resolver.createDirector({ name });

        expect(result).toEqual({
          success: true,
          director: expect.objectContaining({
            id: expect.any(Number),
            uuid: expect.any(String),
            name,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          }),
        });
      });
    });
  });
});
