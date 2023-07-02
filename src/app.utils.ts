import { ValueTransformer } from 'typeorm';

export function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
}

export class CapitalizeTransform implements ValueTransformer {
  to(value: string) {
    return capitalize(value);
  }

  from(value: string) {
    return capitalize(value);
  }
}
