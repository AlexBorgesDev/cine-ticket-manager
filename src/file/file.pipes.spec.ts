import { MutationError } from '~/errors/errors.errors';

import { fileMaxSize } from './file.constants';
import { FileValidationPipe } from './file.pipes';

describe('FileValidationPipe', () => {
  let pipe: FileValidationPipe;

  beforeAll(() => {
    pipe = new FileValidationPipe();
  });

  describe('with invalid type', () => {
    describe('with invalid file type', () => {
      it('throws a MutationError of type INVALID_FILE_TYPE', async () => {
        const file = <Express.Multer.File>{ mimetype: 'audio/mp3' };

        await expect(async () => pipe.transform(file)).rejects.toThrowError(new MutationError('INVALID_FILE_TYPE'));
      });
    });

    describe('with a size too big for file type', () => {
      describe('with image type files', () => {
        it('throws a MutationError of type INVALID_FILE_SIZE', async () => {
          const file = <Express.Multer.File>{ mimetype: 'image/png', size: fileMaxSize.image + 1 };

          await expect(async () => pipe.transform(file)).rejects.toThrowError(
            new MutationError('INVALID_FILE_SIZE', [
              `The maximum size in bytes allowed for images is: ${fileMaxSize.image}`,
            ]),
          );
        });
      });

      describe('with video type files', () => {
        it('throws a MutationError of type INVALID_FILE_SIZE', async () => {
          const file = <Express.Multer.File>{ mimetype: 'video/mp4', size: fileMaxSize.video + 1 };

          await expect(async () => pipe.transform(file)).rejects.toThrowError(
            new MutationError('INVALID_FILE_SIZE', [
              `The maximum size in bytes allowed for videos is: ${fileMaxSize.video}`,
            ]),
          );
        });
      });
    });
  });

  describe('with valid type', () => {
    it('returns file', () => {
      const file = <Express.Multer.File>{ mimetype: 'video/mp4', size: 1234 };

      expect(pipe.transform(file)).toEqual(file);
    });
  });
});
