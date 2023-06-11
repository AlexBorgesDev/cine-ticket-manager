import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ENVs } from '~/@global/env.validation';
import { databaseConfig } from '~/database/database.constants';
import { HttpExceptionFilter } from '~/errors/errors.filters';

@Resolver()
class TestResolver {
  @Query(() => String)
  envName() {
    return 'test';
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: ENVs.validate }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...databaseConfig(configService),
        entities: ['src/**/*.entity.ts'],
        migrations: ['src/database/migrations/*.ts'],
        dropSchema: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      sortSchema: true,
    }),
  ],
  providers: [
    TestResolver,
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class BaseE2eModule {}
