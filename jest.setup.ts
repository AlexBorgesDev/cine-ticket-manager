process.env.ENV_NAME = 'unit_test';

import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

import { databaseSubscribers } from '~/database/database.constants';
import { User } from '~/user/user.entity';
import { UserRole } from '~/user/user.types';

export const superUnitTestUserEmail = 'super_jest_test_user@email.com';
let superUser: User;

jest.mock('./src/user/user.utils', () => {
  const originalModule = jest.requireActual('./src/user/user.utils');
  return { ...originalModule, getCurrentUser: jest.fn(() => superUser) };
});

const db = newDb({ autoCreateForeignKeyIndices: true });
let dataSource: DataSource;

beforeAll(async () => {
  db.public.registerFunction({ name: 'current_database', implementation: () => 'cine-ticket-manager-test' });
  db.public.registerFunction({ name: 'version', implementation: () => '1' });

  dataSource = (await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: ['src/**/*.entity.ts'],
    subscribers: databaseSubscribers(['src/**/*.subscriber.ts']),
    synchronize: true,
  })) as DataSource;

  superUser = await User.create({
    name: 'Super Test User',
    email: superUnitTestUserEmail,
    password: '0123456789',
    role: UserRole.SUPER_ADMIN,
  }).save();
});

afterAll(async () => {
  if (dataSource) await dataSource.destroy();
});
