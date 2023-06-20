import { newDb } from 'pg-mem';
import { DataSource } from 'typeorm';

const db = newDb({ autoCreateForeignKeyIndices: true });

let dataSource: DataSource;

beforeAll(async () => {
  db.public.registerFunction({ name: 'current_database', implementation: () => 'cine-ticket-manager-test' });

  db.public.registerFunction({ name: 'version', implementation: () => '1' });

  dataSource = (await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: ['src/**/*.entity.ts'],
    subscribers: ['**/*.subscriber.ts'],
    synchronize: true,
  })) as DataSource;
});

afterAll(async () => {
  if (dataSource) await dataSource.destroy();
});
