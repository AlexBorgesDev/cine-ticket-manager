import { Logger } from '@nestjs/common';
import { validateSync } from 'class-validator';
import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { ActivityLog } from '~/activity-log/activity-log.entity';
import { ActivityLogActionPrefix } from '~/activity-log/activity-log.types';
import { MutationError } from '~/errors/errors.errors';
import { UserRole } from '~/user/user.types';
import { getCurrentUser } from '~/user/user.utils';

import { MODIFICATION_ALLOWED_ONLY_KEY } from './database.constants';
import { BaseEntity } from './database.models';

@EventSubscriber()
export class DatabaseSubscriber implements EntitySubscriberInterface {
  afterLoad(entity: any): void | Promise<any> {
    this.validateEntity(entity);
  }

  beforeInsert(event: InsertEvent<any>): void | Promise<any> {
    const entity = event.entity;

    if (!entity.uuid) entity.uuid = uuid();

    this.validateEntity(entity);
  }

  async afterInsert(event: InsertEvent<BaseEntity>): Promise<void | Promise<any>> {
    await this.activityLog(ActivityLogActionPrefix.CREATES, event.entity, event.manager);
  }

  async afterUpdate(event: UpdateEvent<BaseEntity>): Promise<void | Promise<any>> {
    await this.activityLog(ActivityLogActionPrefix.UPDATES, event.databaseEntity, event.manager);
  }

  async afterRemove(event: RemoveEvent<BaseEntity>): Promise<void | Promise<any>> {
    await this.activityLog(ActivityLogActionPrefix.DELETES, event.entity || event.databaseEntity, event.manager);
  }

  async afterSoftRemove(event: SoftRemoveEvent<BaseEntity>): Promise<void | Promise<any>> {
    await this.activityLog(ActivityLogActionPrefix.DELETES_SOFT, event.entity || event.databaseEntity, event.manager);
  }

  protected async activityLog(action: ActivityLogActionPrefix, entity: BaseEntity, manager: EntityManager) {
    // Gets the values passed by the decorator @ModificationAllowedOnly
    const modificationAllowedOnly: UserRole[] | null = Reflect.getMetadata(
      MODIFICATION_ALLOWED_ONLY_KEY,
      entity.constructor.prototype,
    );

    if (!modificationAllowedOnly || modificationAllowedOnly.length === Object.keys(UserRole).length) return;

    const user = getCurrentUser();
    const entityName = entity.constructor.name;
    const logAction = `${action}${entityName.toUpperCase()}`;

    if (!user || !modificationAllowedOnly.includes(user.role)) {
      this.logger.error(
        `ACTION: ${logAction} -- USER UUID: ${user.uuid} -- MESSAGE: User without enough privileges`,
        undefined,
        entityName,
      );

      throw new MutationError('FORBIDDEN');
    }

    const log = ActivityLog.create({ action: logAction, details: entity, user });
    await manager.save(log);
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

  protected logger: Logger = new Logger();
}
