import { Logger } from '@nestjs/common';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';

import { MODIFICATION_ALLOWED_ONLY_KEY } from '~/database/database.constants';
import { BaseEntity } from '~/database/database.models';
import { MutationError } from '~/errors/errors.errors';
import { UserRole } from '~/user/user.types';
import { getCurrentUser } from '~/user/user.utils';

import { ActivityLog } from './activity-log.entity';
import { ActivityLogActionPrefix, DatabaseEvent } from './activity-log.types';

@EventSubscriber()
export class ActivityLogSubscriber implements EntitySubscriberInterface<BaseEntity> {
  protected logger: Logger = new Logger();

  protected userRolesLength = Object.keys(UserRole).length;

  listenTo() {
    return BaseEntity;
  }

  async afterInsert(event: InsertEvent<BaseEntity>): Promise<any> {
    await this.insertLog(ActivityLogActionPrefix.CREATES, event);
  }

  async afterUpdate(event: UpdateEvent<BaseEntity>): Promise<any> {
    await this.insertLog(ActivityLogActionPrefix.UPDATES, event);
  }

  async afterRemove(event: RemoveEvent<BaseEntity>): Promise<any> {
    await this.insertLog(ActivityLogActionPrefix.DELETES, event);
  }

  async afterSoftRemove(event: SoftRemoveEvent<BaseEntity>): Promise<any> {
    await this.insertLog(ActivityLogActionPrefix.DELETES_SOFT, event);
  }

  async insertLog(action: ActivityLogActionPrefix, event: DatabaseEvent<BaseEntity>) {
    const entity = event.entity || event.databaseEntity;
    const manager = event.manager;

    // Gets the values passed by the decorator @ModificationAllowedOnly
    const modificationAllowedOnly: UserRole[] | null = Reflect.getMetadata(
      MODIFICATION_ALLOWED_ONLY_KEY,
      entity.constructor.prototype,
    );

    if (!modificationAllowedOnly || modificationAllowedOnly.length === this.userRolesLength) return;

    const user = getCurrentUser();
    const entityName = entity.constructor.name;
    const logAction = `${action}${entityName.toUpperCase()}`;

    if (user && modificationAllowedOnly.includes(user.role)) {
      const activityLog = ActivityLog.create({ action: logAction, details: entity, user });
      return await manager.save(activityLog);
    }

    const error = new MutationError('FORBIDDEN');

    this.logger.error(`ACTION: ${logAction} -- USER UUID: ${user.uuid} -- MESSAGE: ${error.message}`);
    throw error;
  }
}
