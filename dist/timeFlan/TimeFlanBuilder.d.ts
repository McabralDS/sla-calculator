import { Holiday, TimeFlanOptions } from "../types";
export declare class TimeFlanBuilder {
    private options;
    constructor(init?: TimeFlanOptions);
    set(options: TimeFlanOptions): this;
    country(country: string): this;
    state(state: string): this;
    startHour(hour: number): this;
    endHour(hour: number): this;
    workHours(hours: number): this;
    date(date: string | Date): this;
    extraHolidays(holidays: Holiday[]): this;
    isHoliday(date?: string | Date): boolean;
    getHolidays(date?: string | Date): string[];
    isWeekend(date?: string | Date): boolean;
    isBusinessDay(date?: string | Date): boolean;
    nextBusinessDay(date?: string | Date): Date;
    calculate(): string;
}
