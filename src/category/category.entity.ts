import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CapitalizeTransform } from '~/@global/utils';
import { ModificationAllowedOnly } from '~/database/database.decorators';
import { BaseEntity } from '~/database/database.models';

@ObjectType()
@Entity('categories')
@ModificationAllowedOnly(['ADMIN', 'EMPLOYER', 'SUPER_ADMIN'])
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column({ unique: true, transformer: new CapitalizeTransform() })
  @Matches(/^[A-Za-zÀ-ÿ ]+$/g)
  @IsString()
  @IsNotEmpty()
  name: string;
}
