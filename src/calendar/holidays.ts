import { formatISODate, toDate } from '../utils/date.utils';

export function isHoliday(date: string | Date, state?: string, extras: (string | Date)[] = []): boolean {
  const d = toDate(date);
  const iso = formatISODate(d);

  const national = ['2025-01-01', '2025-12-25'];
  const stateMap: Record<string, string[]> = {
    SC: ['2025-09-07'],
    SP: ['2025-07-09']
  };

  const stateHolidays = state ? stateMap[state] ?? [] : [];
  const extra = extras.map(toDate).map(formatISODate);

  return national.includes(iso) || stateHolidays.includes(iso) || extra.includes(iso);
}
