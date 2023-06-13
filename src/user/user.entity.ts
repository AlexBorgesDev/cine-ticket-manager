import { Field, ObjectType } from '@nestjs/graphql';
import { genSaltSync, hash } from 'bcrypt';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, Matches, MinLength } from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BaseEntity } from '~/@global/models';

import { UserRole } from './user.types';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Index({ unique: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  @Matches(/^[A-Za-zÀ-ÿ ]+$/g)
  @MinLength(2)
  name: string;

  @Field()
  @Index({ unique: true })
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

  @Field()
  @IsUUID()
  @Index({ unique: true })
  @Column()
  uuid: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

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
