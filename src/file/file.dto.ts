import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { capitalize } from '~/app.utils';

import { FileCategory } from './file.types';

export class UploadFileDto {
  @IsEnum(FileCategory)
  category: FileCategory;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => (value ? capitalize(value) : value))
  alt?: string;
}
