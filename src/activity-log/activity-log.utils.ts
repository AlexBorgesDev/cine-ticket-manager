import { ValueTransformer } from 'typeorm';

export class ActivityLogDetailsTransform implements ValueTransformer {
  to(value: Record<string, any>) {
    return JSON.stringify(value);
  }

  from(value: string) {
    return JSON.parse(value);
  }
}
