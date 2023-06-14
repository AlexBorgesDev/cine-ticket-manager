import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from '~/@global/models';
import { User } from '~/user/user.entity';

import { ActivityLogAction } from './activity-log.types';
import { ActivityLogDetailsTransform } from './activity-log.utils';

@ObjectType()
@Entity('activity_logs')
export class ActivityLog extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column()
  userId: number;

  @IsEnum(ActivityLogAction)
  @Field(() => String)
  @Column('varchar')
  action: ActivityLogAction | keyof typeof ActivityLogAction;

  @Field(() => String)
  @Column('json', { transformer: new ActivityLogDetailsTransform() })
  details: Record<string, any>;

  @Field()
  @Index({ unique: true })
  @Column({ unique: true })
  uuid: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.activityLogs, { lazy: true })
  user: Promise<Relation<User>>;
}
