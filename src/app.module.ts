import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ENVs } from './@global/env.validation';
import { EnvName } from './@global/types';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './database/database.constants';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: ENVs.validate }),
    TypeOrmModule.forRootAsync({ useFactory: databaseConfig, inject: [ConfigService] }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const envName = configService.get<EnvName>('ENV_NAME');

        return {
          autoSchemaFile: true,
          playground: envName === EnvName.development || envName === EnvName.stage,
          sortSchema: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
