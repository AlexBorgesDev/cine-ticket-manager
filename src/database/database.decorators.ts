import { UserRole } from '~/user/user.types';

import { MODIFICATION_ALLOWED_ONLY_KEY } from './database.constants';

export function ModificationAllowedOnly(roles: (UserRole | keyof typeof UserRole)[]): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(MODIFICATION_ALLOWED_ONLY_KEY, roles, target.prototype);
  };
}
