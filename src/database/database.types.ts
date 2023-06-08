import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export type DBConfigs = (configService?: ConfigService) => DataSourceOptions;
