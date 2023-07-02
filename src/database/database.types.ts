import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

type OptionsOverride = Partial<
  Omit<PostgresConnectionOptions, 'subscribers' | 'type'> & {
    subscribers: string[];
  }
>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type DBSubscribers = (override?: (string | Function)[]) => (string | Function)[];

export type DBConfigs = (config?: ConfigService, override?: OptionsOverride) => PostgresConnectionOptions;
