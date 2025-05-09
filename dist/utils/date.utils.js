"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDate = toDate;
exports.formatISODate = formatISODate;
exports.isWeekend = isWeekend;
exports.createUtcDateWithHour = createUtcDateWithHour;
function toDate(input) {
    if (input instanceof Date) {
        return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate(), input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds(), input.getUTCMilliseconds()));
    }
    const match = input.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?Z?)?$/)?.map((v) => v ?? '0');
    if (match) {
        const [_, year, month, day, hour, minute, second, millisecond,] = match;
        return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second), parseInt(millisecond.padEnd(3, '0'))));
    }
    throw new Error(`Invalid date format: ${input}`);
}
function formatISODate(date) {
    return date.toISOString(); // Retorna o formato completo com o timestamp
}
function isWeekend(date) {
    const day = date.getUTCDay();
    return day === 0 || day === 6;
}
function createUtcDateWithHour(date, hour, offsetDay) {
    const dateToUse = new Date(date);
    if (offsetDay) {
        dateToUse.setUTCDate(dateToUse.getUTCDate() + offsetDay);
    }
    return new Date(Date.UTC(dateToUse.getUTCFullYear(), dateToUse.getUTCMonth(), dateToUse.getUTCDate(), hour));
}
