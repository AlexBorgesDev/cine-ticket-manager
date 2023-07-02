import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { AfterLoad, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { capitalize } from '~/app.utils';
import { ModificationAllowedOnly } from '~/database/database.decorators';
import { BaseEntity } from '~/database/database.models';

@ObjectType()
@Entity('categories')
@ModificationAllowedOnly(['ADMIN', 'EMPLOYER', 'SUPER_ADMIN'])
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column({ unique: true })
  @Matches(/^[A-Za-zÀ-ÿ- ]+$/g)
  @IsString()
  @IsNotEmpty()
  name: string;

  @AfterLoad()
  @BeforeInsert()
  protected onBeforeInsert() {
    if (this.name) this.name = capitalize(this.name);
  }
}
