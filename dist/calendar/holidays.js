"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHolidays = getHolidays;
exports.isHoliday = isHoliday;
exports.calculateEaster = calculateEaster;
exports.calculateGodsFriday = calculateGodsFriday;
exports.calculateCorpusChristi = calculateCorpusChristi;
exports.calculateCarnival = calculateCarnival;
const date_utils_js_1 = require("../utils/date.utils.js");
const holidaysConfig_js_1 = __importDefault(require("./holidaysConfig.js"));
function getHolidays(country, state, year, extraHolidays) {
    const holidays = [];
    // National Holidays
    const nationalHolidays = holidaysConfig_js_1.default;
    const nationalHolidaysByCountry = nationalHolidays[country] ?? { national: [] };
    const nationalHolidaysByCountryDates = nationalHolidaysByCountry.national.map((holiday) => {
        return (0, date_utils_js_1.formatISODate)((0, date_utils_js_1.toDate)(`${year}-${holiday.date}`));
    });
    holidays.push(...nationalHolidaysByCountryDates);
    // State Holidays
    const nationalHolidaysByState = nationalHolidaysByCountry.state?.[state] ?? [];
    const nationalHolidaysByStateDates = nationalHolidaysByState.map((holiday) => {
        return (0, date_utils_js_1.formatISODate)((0, date_utils_js_1.toDate)(`${year}-${holiday.date}`));
    });
    holidays.push(...nationalHolidaysByStateDates);
    // Easter-related Holidays
    const easterDate = calculateEaster(year);
    holidays.push(easterDate); // Easter Sunday
    holidays.push(calculateGodsFriday(year)); // Good Friday
    holidays.push(calculateCorpusChristi(year)); // Corpus Christi
    holidays.push(calculateCarnival(year)); // Carnival
    // Extra Holidays
    const extraHolidaysDates = extraHolidays.map((holiday) => {
        return (0, date_utils_js_1.formatISODate)((0, date_utils_js_1.toDate)(holiday.date));
    });
    holidays.push(...extraHolidaysDates);
    return holidays;
}
function isHoliday(date, country, state, extras = []) {
    const d = (0, date_utils_js_1.toDate)(date);
    const year = d.getUTCFullYear();
    const holidays = getHolidays(country ?? 'BR', state ?? '', year, extras);
    return holidays.some((holiday) => holiday.startsWith((0, date_utils_js_1.formatISODate)(d).split('T')[0]));
}
function calculateEaster(year) {
    const C = Math.floor(year / 100);
    const N = year - 19 * Math.floor(year / 19);
    const K = Math.floor((C - 17) / 25);
    let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
    I = I - 30 * Math.floor(I / 30);
    I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
    let J = year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4);
    J = J - 7 * Math.floor(J / 7);
    let L = I - J;
    const M = 3 + Math.floor((L + 40) / 44);
    const D = L + 28 - 31 * Math.floor(M / 4);
    const month = (M < 10 ? '0' : '') + M;
    const day = (D < 10 ? '0' : '') + D;
    return `${year}-${month}-${day}T00:00:00.000Z`;
}
function calculateGodsFriday(year) {
    const easterDate = (0, date_utils_js_1.toDate)(calculateEaster(year));
    easterDate.setUTCDate(easterDate.getUTCDate() - 2);
    return (0, date_utils_js_1.formatISODate)(easterDate);
}
function calculateCorpusChristi(year) {
    const easterDate = (0, date_utils_js_1.toDate)(calculateEaster(year));
    easterDate.setUTCDate(easterDate.getUTCDate() + 60);
    return (0, date_utils_js_1.formatISODate)(easterDate);
}
function calculateCarnival(year) {
    const easterDate = (0, date_utils_js_1.toDate)(calculateEaster(year));
    easterDate.setUTCDate(easterDate.getUTCDate() - 47);
    return (0, date_utils_js_1.formatISODate)(easterDate);
}
