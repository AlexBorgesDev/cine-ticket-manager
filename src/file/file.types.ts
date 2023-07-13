import { registerEnumType } from '@nestjs/graphql';

export enum FileState {
  DONE = 'DONE',
  ERROR = 'ERROR',
  PENDING_OPTIMIZATION = 'PENDING_OPTIMIZATION',
  OPTIMIZING = 'OPTIMIZING',
  RETRY_OPTIMIZATION = 'RETRY_OPTIMIZATION',
}

export enum FileCategory {
  BANNER = 'BANNER',
  TRAILER = 'TRAILER',
}

registerEnumType(FileCategory, { name: 'FileCategory' });
