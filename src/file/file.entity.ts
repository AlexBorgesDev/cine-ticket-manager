import { Field, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

import { ModificationAllowedOnly } from '~/database/database.decorators';
import { StateMachine } from '~/state-machine/state-machine.model';
import { StatesConfig } from '~/state-machine/state-machine.types';

import { fileStatesConfig } from './file.constants';
import { FileCategory, FileState } from './file.types';

@ObjectType()
@Entity('files')
@ModificationAllowedOnly(['ADMIN', 'EMPLOYER', 'SUPER_ADMIN'])
export class File extends StateMachine<FileState> {
  @Exclude()
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Field()
  @Column()
  bucket: string;

  @Index()
  @Field(() => FileCategory)
  @Column({ type: 'enum', enum: FileCategory })
  @IsEnum(FileCategory)
  category: FileCategory | keyof typeof FileCategory;

  @Field()
  @Column({ unique: true })
  filename: string;

  @Index()
  @Field()
  @Column()
  mimetype: string;

  @Field()
  @Column()
  size: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  alt: string;

  @Exclude()
  protected readonly statesConfig: StatesConfig<FileState> = fileStatesConfig;
}
