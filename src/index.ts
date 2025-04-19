import { SlaBuilder } from './sla/SlaBuilder';
import { SlaOptions } from './types';

export function Sla(options?: SlaOptions) {
  return new SlaBuilder(options);
}

export { SlaBuilder };