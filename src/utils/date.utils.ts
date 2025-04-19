export function toDate(input: string | Date): Date {
  return input instanceof Date ? input : new Date(input);
}

export function formatISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}