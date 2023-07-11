import { Type, plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf, validateSync } from 'class-validator';

export enum EnvName {
  LIVE = 'live',
  TEST = 'test',
  STAGE = 'stage',
  UNIT_TEST = 'unit_test',
  DEVELOPMENT = 'development',
}

export class ENVs {
  @IsEnum(EnvName)
  ENV_NAME: EnvName | keyof typeof EnvName;

  @IsString()
  @IsNotEmpty()
  AWS_REGION: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  AWS_ENDPOINT: string;

  @IsString()
  @IsNotEmpty()
  AWS_S3_BUCKET: string;

  @IsString()
  @IsNotEmpty()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  @IsNotEmpty()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
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
  @ValidateIf((o) => o.ENV_NAME === EnvName.TEST)
  DB_DATABASE_TEST: string;

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
    return process.env.ENV_NAME === EnvName.UNIT_TEST;
  }
}
