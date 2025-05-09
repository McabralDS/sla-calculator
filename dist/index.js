"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeFlanBuilder = void 0;
exports.TimeFlan = TimeFlan;
const TimeFlanBuilder_js_1 = require("./timeFlan/TimeFlanBuilder.js");
Object.defineProperty(exports, "TimeFlanBuilder", { enumerable: true, get: function () { return TimeFlanBuilder_js_1.TimeFlanBuilder; } });
function TimeFlan(options) {
    return new TimeFlanBuilder_js_1.TimeFlanBuilder(options);
}
