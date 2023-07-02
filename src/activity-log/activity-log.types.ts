import { EntityManager, ObjectLiteral } from 'typeorm';

export enum ActivityLogActionPrefix {
  CREATES = 'CREATES_',
  UPDATES = 'UPDATES_',
  DELETES = 'DELETES_',
  DELETES_SOFT = 'DELETES_SOFT_',
}

export type DatabaseEvent<T> = { manager: EntityManager } & (
  | { entity?: T | ObjectLiteral; databaseEntity: T }
  | { entity: T | ObjectLiteral; databaseEntity?: T }
);
