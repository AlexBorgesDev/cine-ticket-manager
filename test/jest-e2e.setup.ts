import { DataSource } from 'typeorm';

import { databaseConfig } from '~/database/database.constants';
import { EnvName } from '~/env.validation';

let dataSource: DataSource;

beforeAll(async () => {
  process.env.ENV_NAME = EnvName.test;

  dataSource = new DataSource(
    databaseConfig(null, {
      entities: ['src/**/*.entity.ts'],
      migrations: ['src/database/migrations/*.ts'],
      subscribers: ['src/**/*.subscriber.ts'],
      synchronize: true,
      migrationsRun: false,
    }),
  );

  if (!dataSource.isInitialized) await dataSource.initialize();

  const entities = dataSource.entityMetadatas;
  const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ');

  await dataSource.query(`TRUNCATE ${tableNames} CASCADE;`);
});

afterAll(async () => {
  if (dataSource.isInitialized) await dataSource.destroy();
});
