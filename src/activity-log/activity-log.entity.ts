import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

import { ENVs } from '~/@global/env.validation';
import { BaseEntity } from '~/database/database.models';
import { User } from '~/user/user.entity';

import { ActivityLogDetailsTransform } from './activity-log.utils';

@ObjectType()
@Entity('activity_logs')
export class ActivityLog extends BaseEntity {
  @PrimaryGeneratedColumn('increment', !ENVs.isUnitTest && { type: 'bigint' })
  id: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  @Column('varchar')
  action: string;

  @Field(() => String)
  @Column('json', { transformer: new ActivityLogDetailsTransform() })
  details: Record<string, any>;

  @Index()
  @ManyToOne(() => User, (user) => user.activityLogs, { lazy: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Relation<User> | Promise<Relation<User>>;
}
