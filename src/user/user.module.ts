import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { CurrentUserInterceptor } from './user.interceptor';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  providers: [UserService, UserResolver, { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor }],
})
export class UserModule {}
