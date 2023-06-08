import { Logger as NestLogger } from '@nestjs/common';
import { LogLevel, Logger as TypeOrmLogger } from 'typeorm';

export class DatabaseLogger implements TypeOrmLogger {
  private readonly logger = new NestLogger('SQL');

  constructor(private readonly levels: LogLevel[] = ['info', 'log', 'warn']) {}

  logQuery(query: string, parameters?: unknown[]) {
    if (!parameters) return this.logger.log(query);

    this.logger.log(`${query} -- Parameters: ${this.stringifyParameters(parameters)}`);
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    if (!parameters) return this.logger.error(query);

    this.logger.error(`${query} -- Parameters: ${this.stringifyParameters(parameters)} -- ${error}`);
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    if (!parameters) return this.logger.warn(query);

    this.logger.warn(`Time: ${time} -- Parameters: ${this.stringifyParameters(parameters)} -- ${query}`);
  }

  logMigration(message: string) {
    this.logger.log(message);
  }

  logSchemaBuild(message: string) {
    this.logger.log(message);
  }

  log(level: LogLevel, message: string) {
    if (level === 'log' && this.levels.includes(level)) {
      return this.logger.log(message);
    }
    if (level === 'info' && this.levels.includes(level)) {
      return this.logger.debug(message);
    }
    if (level === 'warn' && this.levels.includes(level)) {
      return this.logger.warn(message);
    }
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters);
    } catch {
      return '';
    }
  }
}
