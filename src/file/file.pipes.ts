import { Injectable, PipeTransform } from '@nestjs/common';

import { MutationError } from '~/errors/errors.errors';

import { fileAcceptedTypes, fileMaxSize } from './file.constants';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!fileAcceptedTypes.includes(file.mimetype)) {
      throw new MutationError('INVALID_FILE_TYPE', [
        `Only items of the type are allowed: (${fileAcceptedTypes.join('|').replace(/(image|video)\//g, '')})`,
      ]);
    }

    if (/(video)/g.test(file.mimetype) && file.size > fileMaxSize.video) throw this.generateSizeError('video');
    else if (file.size > fileMaxSize.image) throw this.generateSizeError('image');

    return file;
  }

  private generateSizeError(type: keyof typeof fileMaxSize) {
    throw new MutationError('INVALID_FILE_SIZE', [
      `The maximum size in bytes allowed for ${type}s is: ${fileMaxSize[type]}`,
    ]);
  }
}
