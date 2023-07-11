import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { AWSModule } from './aws/aws.module';
import { CategoryModule } from './category/category.module';
import { databaseConfig } from './database/database.constants';
import { DirectorModule } from './director/director.module';
import { ENVs, EnvName } from './env.validation';
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
          playground: envName === EnvName.DEVELOPMENT || envName === EnvName.STAGE,
          sortSchema: true,
        };
      },
      inject: [ConfigService],
    }),
    AWSModule,
    AuthModule,
    UserModule,
    CategoryModule,
    DirectorModule,
  ],
})
export class AppModule {}
