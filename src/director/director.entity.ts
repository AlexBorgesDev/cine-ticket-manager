import { Field, ObjectType } from '@nestjs/graphql';
import { Matches, MinLength } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ModificationAllowedOnly } from '~/database/database.decorators';
import { BaseEntity } from '~/database/database.models';

@ObjectType()
@Entity('directors')
@ModificationAllowedOnly(['EMPLOYER', 'ADMIN', 'SUPER_ADMIN'])
export class Director extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Index()
  @Column()
  @Matches(/^[A-Za-zÀ-ÿ ]+$/g)
  @MinLength(2)
  name: string;
}
