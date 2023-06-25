// eslint-disable-next-line import/order
import { EnvName } from '~/@global/types';

process.env.ENV_NAME = EnvName.unitTest;

import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

import { User } from '~/user/user.entity';
import { UserRole } from '~/user/user.types';

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
    subscribers: ['src/**/*.subscriber.ts'],
    synchronize: true,
  })) as DataSource;

  superUser = await User.create({
    name: 'Super Test User',
    email: 'super_jest_test_user@email.com',
    password: '0123456789',
    role: UserRole.SUPER_ADMIN,
  }).save();
});

afterAll(async () => {
  if (dataSource) await dataSource.destroy();
});
