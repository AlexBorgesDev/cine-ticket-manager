import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column, Index } from 'typeorm';

import { BaseEntity } from '~/database/database.models';

import { StatesConfig } from './state-machine.types';

@ObjectType()
export abstract class StateMachine<T extends string | symbol> extends BaseEntity {
  @Field(() => String)
  @Index()
  @Column('varchar')
  @IsNotEmpty()
  state: T;

  protected abstract readonly statesConfig: StatesConfig<T>;
}
