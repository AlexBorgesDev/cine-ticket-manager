import { validateSync } from 'class-validator';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MutationError } from '~/errors/errors.errors';

import { BaseEntity } from './database.models';

@EventSubscriber()
export class DatabaseSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<any>): void | Promise<any> {
    const entity = event.entity;

    if (entity instanceof BaseEntity) {
      if (!entity.uuid) entity.uuid = uuid();
    }

    const errors = validateSync(entity);
    if (errors.length > 0) {
      throw new MutationError(
        'INVALID_INPUT',
        errors.map((e) => e.property),
      );
    }
  }
}
