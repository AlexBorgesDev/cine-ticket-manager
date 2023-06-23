import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, validateSync } from 'class-validator';

import { EnvName } from './types';

export class ENVs {
  @IsEnum(EnvName)
  ENV_NAME: EnvName | keyof typeof EnvName;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsInt()
  @IsNotEmpty()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  @IsNotEmpty()
  DB_PASS: string;

  @IsString()
  @IsNotEmpty()
  DB_DATABASE: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  static validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(ENVs, config, {
      enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) throw new Error(errors.toString());
    return validatedConfig;
  }

  static isUnitTest() {
    return process.env.ENV_NAME === EnvName.unitTest;
  }
}
