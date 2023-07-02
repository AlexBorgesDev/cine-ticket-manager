import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';

import { StateMachineError } from './state-machine.errors';
import { StateMachine } from './state-machine.model';

@EventSubscriber()
export class StateMachineSubscriber implements EntitySubscriberInterface<StateMachine<any>> {
  listenTo() {
    return StateMachine;
  }

  beforeInsert({ entity }: InsertEvent<StateMachine<any>>): void | Promise<any> {
    const { initialState } = entity['statesConfig'];

    if (entity.state && entity.state !== initialState) {
      throw new StateMachineError({ message: 'Invalid initial state', value: entity.state });
    }

    entity.state = initialState;
  }

  beforeUpdate(event: UpdateEvent<StateMachine<any>>): void | Promise<any> {
    this.checkNewState(event.entity as StateMachine<any>, event.databaseEntity);
  }

  beforeRemove(event: RemoveEvent<StateMachine<any>>): void | Promise<any> {
    this.checkNewState(event.entity || event.databaseEntity, event.databaseEntity);
  }

  beforeSoftRemove(event: SoftRemoveEvent<StateMachine<any>>): void | Promise<any> {
    this.checkNewState(event.entity || event.databaseEntity, event.databaseEntity);
  }

  private checkNewState(entity: StateMachine<any>, databaseEntity: StateMachine<any>) {
    if (entity.state === databaseEntity.state) return;

    const { from } = databaseEntity['statesConfig'].states[entity.state];

    if (from.includes(databaseEntity.state)) return;
    throw new StateMachineError({ message: 'New state error', from: databaseEntity.state, to: entity.state });
  }
}
