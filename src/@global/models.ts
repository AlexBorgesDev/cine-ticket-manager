import { validateSync } from 'class-validator';
import { BeforeInsert, BaseEntity as TypeOrmBaseEntity } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { MutationError } from '~/errors/errors.errors';

export abstract class BaseEntity extends TypeOrmBaseEntity {
  abstract id: number | string;

  abstract uuid: string;

  @BeforeInsert()
  protected onValidateBeforeInsert() {
    if (!this.uuid) this.uuid = uuid();

    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new MutationError(
        'INVALID_INPUT',
        errors.map((e) => e.property),
      );
    }
  }
}
