import { Field, ObjectType } from '@nestjs/graphql';
import { genSaltSync, hash } from 'bcrypt';
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { ActivityLog } from '~/activity-log/activity-log.entity';
import { BaseEntity } from '~/database/database.models';

import { UserRole } from './user.types';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  @Matches(/^[A-Za-zÀ-ÿ ]+$/g)
  @MinLength(2)
  name: string;

  @Field()
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @MinLength(8)
  password: string;

  @Field(() => UserRole)
  @IsEnum(UserRole)
  @IsOptional()
  @Index()
  @Column({ default: UserRole.USER })
  role: UserRole;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.user, { lazy: true, cascade: true })
  activityLogs: Promise<Relation<ActivityLog[]>>;

  @Field(() => Boolean)
  get isAdmin() {
    return this.role === UserRole.ADMIN;
  }

  @Field(() => Boolean)
  get isEmployer() {
    return this.role === UserRole.EMPLOYER;
  }

  @Field(() => Boolean)
  get isSuperAdmin() {
    return this.role === UserRole.SUPER_ADMIN;
  }

  @BeforeInsert()
  protected async onBeforeInsert() {
    if (this.password) this.password = await hash(this.password, genSaltSync());
  }
}
