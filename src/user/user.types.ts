import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYER = 'EMPLOYER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER',
}

registerEnumType(UserRole, { name: 'UserRole' });
