import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

import { BaseEntity } from '~/database/database.models';
import { User } from '~/user/user.entity';

import { ActivityLogAction } from './activity-log.types';
import { ActivityLogDetailsTransform } from './activity-log.utils';

@ObjectType()
@Entity('activity_logs')
export class ActivityLog extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @IsEnum(ActivityLogAction)
  @Field(() => String)
  @Column('varchar')
  action: ActivityLogAction | keyof typeof ActivityLogAction;

  @Field(() => String)
  @Column('json', { transformer: new ActivityLogDetailsTransform() })
  details: Record<string, any>;

  @Index()
  @ManyToOne(() => User, (user) => user.activityLogs, { lazy: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Relation<User> | Promise<Relation<User>>;
}
