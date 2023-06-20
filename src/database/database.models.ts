import { Field, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { Column, CreateDateColumn, BaseEntity as TypeOrmBaseEntity, UpdateDateColumn } from 'typeorm';

@ObjectType()
export abstract class BaseEntity extends TypeOrmBaseEntity {
  abstract id: number | string;

  @Field()
  @IsUUID()
  @Column({ unique: true })
  uuid: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
