import { TimeFlanBuilder } from './timeFlan/TimeFlanBuilder.js';
import { TimeFlanOptions } from './types';

export function TimeFlan(options?: TimeFlanOptions) {
  return new TimeFlanBuilder(options);
}

export { TimeFlanBuilder };