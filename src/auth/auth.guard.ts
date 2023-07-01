import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { MutationError } from '~/errors/errors.errors';

import { AUTH_ROLES } from './auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const roles = this.reflector.get<string[]>(AUTH_ROLES, ctx.getHandler());

    if (!roles) return true;

    const request = ctx.getContext().req;
    const user = request.user;

    if (roles.includes(user.role)) return true;
    throw new MutationError('FORBIDDEN');
  }
}
