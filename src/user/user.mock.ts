import { faker } from '@faker-js/faker';

import { User } from './user.entity';

export const createUser = async (overrides?: Partial<User>, noSave?: boolean): Promise<User> => {
  const user = User.create({
    name: faker.person.fullName(),
    email: faker.internet.email({ lastName: Date.now().toString() }),
    password: faker.internet.password({ length: 12 }),
    ...overrides,
  });

  if (noSave) return user;
  return await user.save();
};
