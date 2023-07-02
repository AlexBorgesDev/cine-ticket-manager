import { DataSource } from 'typeorm';

import { databaseConfig } from './database.constants';

export default new DataSource(
  databaseConfig(null, {
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    subscribers: ['src/**/*.subscriber.ts'],
  }),
);
