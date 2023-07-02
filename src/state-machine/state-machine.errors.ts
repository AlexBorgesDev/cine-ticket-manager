import { InternalServerErrorException } from '@nestjs/common';

import { StateMachineErrorObjectType } from './state-machine.types';

export class StateMachineError extends InternalServerErrorException implements StateMachineErrorObjectType {
  readonly value?: string;

  readonly from?: string;

  readonly to?: string;

  constructor(obj: StateMachineErrorObjectType) {
    super();

    this.message = obj.message;
    this.value = obj.value;
    this.from = obj.from;
    this.to = obj.to;
  }
}
