import { faker } from '@faker-js/faker';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntity, DataSource } from 'typeorm';

import { ActivityLog } from '~/activity-log/activity-log.entity';
import { AuthModule } from '~/auth/auth.module';
import { AuthService } from '~/auth/auth.service';
import { databaseConfig } from '~/database/database.constants';
import { ENVs } from '~/env.validation';
import { HttpExceptionFilter } from '~/errors/errors.filters';
import { User } from '~/user/user.entity';
import { createUser } from '~/user/user.mock';
import { UserModule } from '~/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: ENVs.validate }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return databaseConfig(configService, {
          entities: ['src/**/*.entity.ts'],
          migrations: ['src/database/migrations/*.ts'],
          subscribers: ['src/**/*.subscriber.ts'],
          synchronize: true,
          migrationsRun: false,
        });
      },
      inject: [ConfigService],
    }),
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

export async function e2eUserAndAccessToken(app: INestApplication, override?: Partial<User>) {
  const auth = app.get<AuthService>(AuthService);
  const decryptedPassword = faker.internet.password({ length: 12 });

  const user = await createUser({ ...override, password: decryptedPassword });
  const { accessToken } = await auth.signIn({ email: user.email, password: decryptedPassword });

  return { accessToken, user };
}

export async function e2eClearEntities(entities: (typeof BaseEntity)[]) {
  if (!entities.length) new Error('List of entities to clean is empty');

  const dataSource: DataSource = entities[0]['dataSource'];

  if (!dataSource || !dataSource.isInitialized) return;

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    const tableNames = [ActivityLog, ...entities]
      .map((entity) => `"${dataSource.getMetadata(entity).tableName}"`)
      .join(', ');

    await queryRunner.query(`TRUNCATE ${tableNames} CASCADE;`);
    await queryRunner.commitTransaction();
  } catch (err) {
    console.error(err);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }
}
