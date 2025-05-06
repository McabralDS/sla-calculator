import { Holiday } from '../types';
export declare function getHolidays(country: string, state: string, year: number, extraHolidays: Holiday[]): string[];
export declare function isHoliday(date: string | Date, country?: string, state?: string, extras?: Holiday[]): boolean;
export declare function calculateEaster(year: number): string;
export declare function calculateGodsFriday(year: number): string;
export declare function calculateCorpusChristi(year: number): string;
export declare function calculateCarnival(year: number): string;
