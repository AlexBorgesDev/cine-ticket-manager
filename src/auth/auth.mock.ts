import { faker } from '@faker-js/faker';

import { SignInInput } from './auth.input';

export const createCredential = (overrides?: Partial<SignInInput>): SignInInput => ({
  email: faker.internet.email({ lastName: Date.now().toString() }),
  password: faker.internet.password({ length: 12 }),
  ...overrides,
});
