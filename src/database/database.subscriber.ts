import { Logger } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MutationError } from '~/errors/errors.errors';

import { BaseEntity } from './database.models';

@EventSubscriber()
export class DatabaseSubscriber implements EntitySubscriberInterface {
  protected logger: Logger = new Logger();

  afterLoad(entity: any): void | Promise<any> {
    this.validateEntity(entity);
  }

  beforeInsert({ entity }: InsertEvent<any>): void | Promise<any> {
    if (!entity.uuid) entity.uuid = uuid();

    this.validateEntity(entity);
  }

  protected validateEntity(entity: any) {
    if (!(entity instanceof BaseEntity)) throw new Error('Invalid Entity');

    const errors = validateSync(entity);
    if (errors.length > 0) {
      throw new MutationError(
        'INVALID_INPUT',
        errors.map((e) => e.property),
      );
    }
  }
}
