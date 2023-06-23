import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ENVs } from '~/@global/env.validation';
import { EnvName } from '~/@global/types';

import { DatabaseLogger } from './database.logger';
import { DBConfigs } from './database.types';

export const MODIFICATION_ALLOWED_ONLY_KEY = 'modificationAllowedOnly';

export const databaseConfig: DBConfigs = (service) => {
  const configService = service || new ConfigService();

  if (!service) ConfigModule.forRoot({ validate: ENVs.validate });

  const envName = configService.get<EnvName>('ENV_NAME');
  const isTest = envName === EnvName.test;
  const isDev = envName === EnvName.development;

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASS'),
    database: isTest ? 'cine-ticket-manager-test' : configService.get<string>('DB_DATABASE'),
    logger: isDev && new DatabaseLogger(['log', 'warn']),
    logging: isDev,
    entities: ['**/*.entity.js'],
    migrations: ['database/migrations/*.js'],
    subscribers: ['**/*.subscriber.js'],
    synchronize: false,
    migrationsRun: !isDev,
    namingStrategy: new SnakeNamingStrategy(),
  };
};
