import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IS_PUBLIC_KEY } from './auth.constants';

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().req.user;
});

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
