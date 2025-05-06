import { formatISODate, toDate } from '../utils/date.utils.js';
import configHolidays from './holidaysConfig.js';
import { Holiday, HolidayByCountry } from '../types';

export function getHolidays(country: string, state: string, year: number, extraHolidays: Holiday[]): string[] {
  const holidays: string[] = [];

  // National Holidays
  const nationalHolidays: HolidayByCountry = configHolidays as HolidayByCountry;
  const nationalHolidaysByCountry = nationalHolidays[country] ?? { national: [] };
  const nationalHolidaysByCountryDates = nationalHolidaysByCountry.national.map((holiday) => {
    return formatISODate(toDate(`${year}-${holiday.date}`));
  });
  holidays.push(...nationalHolidaysByCountryDates);

  // State Holidays
  const nationalHolidaysByState = nationalHolidaysByCountry.state?.[state] ?? [];
  const nationalHolidaysByStateDates = nationalHolidaysByState.map((holiday) => {
    return formatISODate(toDate(`${year}-${holiday.date}`));
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
    return formatISODate(toDate(holiday.date));
  });
  holidays.push(...extraHolidaysDates);

  return holidays;
}

export function isHoliday(date: string | Date, country?: string, state?: string, extras: Holiday[] = []): boolean {
  const d = toDate(date);
  const year = d.getUTCFullYear();
  const holidays = getHolidays(country ?? 'BR', state ?? '', year, extras);
  return holidays.some((holiday) => holiday.startsWith(formatISODate(d).split('T')[0]));
}

export function calculateEaster(year: number): string {
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

export function calculateGodsFriday(year: number): string {
  const easterDate = toDate(calculateEaster(year));
  easterDate.setUTCDate(easterDate.getUTCDate() - 2);
  return formatISODate(easterDate);
}

export function calculateCorpusChristi(year: number): string {
  const easterDate = toDate(calculateEaster(year));
  easterDate.setUTCDate(easterDate.getUTCDate() + 60);
  return formatISODate(easterDate);
}

export function calculateCarnival(year: number): string {
  const easterDate = toDate(calculateEaster(year));
  easterDate.setUTCDate(easterDate.getUTCDate() - 47);
  return formatISODate(easterDate);
}
