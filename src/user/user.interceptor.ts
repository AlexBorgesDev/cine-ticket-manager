import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

import { userAsyncLocalStorage } from './user.constants';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const req = GqlExecutionContext.create(context).getContext().req;
    const user = req?.user;

    if (!user) return next.handle();

    return new Observable((observer) => {
      userAsyncLocalStorage.run({ req, user }, () => {
        const response$ = next.handle();

        response$.subscribe({
          next: (data) => observer.next(data),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      });
    });
  }
}
