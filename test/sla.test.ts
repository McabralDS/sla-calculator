import { describe, it, expect } from 'vitest';
import { Sla } from '../src';

describe('SLA Lib', () => {
  it('should calculate 8 hours on business day', () => {
    const sla = Sla().date('2025-12-23T10:00:00Z').workHours(3).finalSla();
    console.log(sla);
    expect(sla).toBe('2025-12-24T13:00Z');
  });

  it('should return 0 on holiday', () => {
    const sla = Sla().date('2025-12-25').extraHolidays(['2025-12-25']).calculate();
    expect(sla).toBe(0);
  });

  it('should detect weekend', () => {
    const sla = Sla().date('2025-12-28'); // Sunday
    expect(sla.isWeekend()).toBe(true);
  });
});
