import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';

import { ENVs } from '~/@global/env.validation';
import { AuthModule } from '~/auth/auth.module';
import { HttpExceptionFilter } from '~/errors/errors.filters';
import { UserModule } from '~/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: ENVs.validate }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      sortSchema: true,
    }),
    AuthModule,
    UserModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class BaseE2eModule {}
