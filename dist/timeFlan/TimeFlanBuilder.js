"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeFlanBuilder = void 0;
const holidays_js_1 = require("../calendar/holidays.js");
const date_utils_js_1 = require("../utils/date.utils.js");
class TimeFlanBuilder {
    constructor(init) {
        this.options = {
            country: "BR",
            state: "SC",
            startHour: 8,
            endHour: 18,
            workHours: 8,
            date: (0, date_utils_js_1.toDate)(new Date()),
            extraHolidays: [],
        };
        if (init)
            this.set(init);
    }
    set(options) {
        this.options = {
            ...this.options,
            ...options,
            date: (0, date_utils_js_1.toDate)(options.date ?? new Date()),
        };
        return this;
    }
    country(country) {
        this.options.country = country.toUpperCase();
        return this;
    }
    state(state) {
        this.options.state = state.toUpperCase();
        return this;
    }
    startHour(hour) {
        if (hour < 0 || hour > 23) {
            throw new Error("Start hour must be between 0 and 23.");
        }
        this.options.startHour = hour;
        return this;
    }
    endHour(hour) {
        if (hour < 0 || hour > 23) {
            throw new Error("End hour must be between 0 and 23.");
        }
        this.options.endHour = hour;
        return this;
    }
    workHours(hours) {
        if (hours < 0) {
            throw new Error("Work hours must be a positive number.");
        }
        this.options.workHours = hours;
        return this;
    }
    date(date) {
        this.options.date = (0, date_utils_js_1.toDate)(date);
        return this;
    }
    extraHolidays(holidays) {
        this.options.extraHolidays = holidays;
        return this;
    }
    isHoliday(date) {
        const data = date ? (0, date_utils_js_1.toDate)(date) : this.options.date;
        return (0, holidays_js_1.isHoliday)(data, this.options.country, this.options.state, this.options.extraHolidays);
    }
    getHolidays(date) {
        const data = date ? (0, date_utils_js_1.toDate)(date) : (0, date_utils_js_1.toDate)(this.options.date);
        const year = data.getUTCFullYear();
        return (0, holidays_js_1.getHolidays)(this.options.country, this.options.state, year, this.options.extraHolidays);
    }
    isWeekend(date) {
        const data = date ? (0, date_utils_js_1.toDate)(date) : this.options.date;
        return (0, date_utils_js_1.isWeekend)((0, date_utils_js_1.toDate)(data));
    }
    isBusinessDay(date) {
        const data = date ? (0, date_utils_js_1.toDate)(date) : this.options.date;
        return !this.isWeekend(data) && !this.isHoliday(data);
    }
    nextBusinessDay(date) {
        const data = date ? (0, date_utils_js_1.toDate)(date) : this.options.date;
        let nextDate = new Date(data);
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        while (!this.isBusinessDay(nextDate)) {
            nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        }
        return nextDate;
    }
    calculate() {
        const { date, workHours, startHour, endHour } = this.options;
        const startDate = (0, date_utils_js_1.toDate)(date);
        let remainingHours = workHours;
        let currentDate = new Date(startDate);
        // Ajuste para começar no próximo dia útil válido
        if (!this.isBusinessDay(currentDate)) {
            currentDate = this.nextBusinessDay(currentDate);
        }
        // Se for dia útil, garante que começa no horário de início
        if (currentDate.getUTCHours() < startHour) {
            currentDate.setUTCHours(startHour, 0, 0, 0);
        }
        while (remainingHours > 0) {
            if (this.isBusinessDay(currentDate)) {
                const workDayStart = (0, date_utils_js_1.createUtcDateWithHour)(currentDate, startHour);
                const workDayEnd = (0, date_utils_js_1.createUtcDateWithHour)(currentDate, endHour);
                if (currentDate < workDayStart) {
                    currentDate = new Date(workDayStart);
                }
                if (currentDate >= workDayEnd) {
                    currentDate = (0, date_utils_js_1.createUtcDateWithHour)(currentDate, startHour, 1);
                    continue;
                }
                const millisAvailable = workDayEnd.getTime() - currentDate.getTime();
                const hoursAvailable = millisAvailable / (1000 * 60 * 60);
                if (hoursAvailable >= remainingHours) {
                    currentDate = new Date(currentDate.getTime() + remainingHours * 60 * 60 * 1000);
                    remainingHours = 0;
                }
                else {
                    remainingHours -= hoursAvailable;
                    currentDate = (0, date_utils_js_1.createUtcDateWithHour)(currentDate, startHour, 1);
                }
            }
            else {
                currentDate = (0, date_utils_js_1.createUtcDateWithHour)(currentDate, startHour, 1);
            }
        }
        return currentDate.toISOString();
    }
}
exports.TimeFlanBuilder = TimeFlanBuilder;
