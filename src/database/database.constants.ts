import { ConfigModule, ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ActivityLogSubscriber } from '~/activity-log/activity-log.subscriber';
import { ENVs, EnvName } from '~/env.validation';
import { StateMachineSubscriber } from '~/state-machine/state-machine.subscriber';

import { DatabaseLogger } from './database.logger';
import { DatabaseSubscriber } from './database.subscriber';
import { DBConfigs, DBSubscribers } from './database.types';

export const MODIFICATION_ALLOWED_ONLY_KEY = 'modificationAllowedOnly';

export const databaseSubscribers: DBSubscribers = (override) => {
  if (override) {
    return [...override, StateMachineSubscriber, DatabaseSubscriber, ActivityLogSubscriber];
  }

  return ['**/*.subscriber.js', StateMachineSubscriber, DatabaseSubscriber, ActivityLogSubscriber];
};

export const databaseConfig: DBConfigs = (service, override) => {
  const configService = service || new ConfigService();

  if (!service) ConfigModule.forRoot({ validate: ENVs.validate });

  const envName = configService.get<EnvName>('ENV_NAME');
  const isTest = envName === EnvName.TEST;
  const isDev = envName === EnvName.DEVELOPMENT;

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASS'),
    database: isTest ? configService.get<string>('DB_DATABASE_TEST') : configService.get<string>('DB_DATABASE'),
    logger: isDev && new DatabaseLogger(['log', 'warn']),
    logging: isDev,
    entities: ['**/*.entity.js'],
    migrations: ['database/migrations/*.js'],
    synchronize: false,
    migrationsRun: !isDev,
    namingStrategy: new SnakeNamingStrategy(),
    ...override,
    subscribers: databaseSubscribers(override?.subscribers),
  };
};
