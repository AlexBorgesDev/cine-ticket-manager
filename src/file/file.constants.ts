import { StatesConfig } from '~/state-machine/state-machine.types';

import { FileState } from './file.types';

export const fileStatesConfig: StatesConfig<FileState> = Object.freeze({
  initialState: FileState.PENDING_OPTIMIZATION,
  states: {
    DONE: { from: [FileState.OPTIMIZING] },
    ERROR: { from: [FileState.OPTIMIZING] },
    OPTIMIZING: { from: [FileState.PENDING_OPTIMIZATION, FileState.RETRY_OPTIMIZATION] },
    PENDING_OPTIMIZATION: { from: [] },
    RETRY_OPTIMIZATION: { from: [FileState.ERROR] },
  },
});

export const fileMaxSize = Object.freeze({
  /** 5MB */
  image: 5242880,
  /** 500MB */
  video: 524288000,
});

export const fileAcceptedTypes = Object.freeze([
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/webp',
  'video/avi',
  'video/mp4',
  'video/mkv',
  'video/webm',
]);
