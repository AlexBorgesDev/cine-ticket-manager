import { S3Service } from './s3.service';

export const S3ServiceMock = () => {
  return <Partial<S3Service>>{ bucket: 'test', destroy: jest.fn(), send: jest.fn() };
};
