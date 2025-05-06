import { TimeFlanBuilder } from './timeFlan/TimeFlanBuilder.js';
export function TimeFlan(options) {
    return new TimeFlanBuilder(options);
}
export { TimeFlanBuilder };
