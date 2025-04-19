import { isHoliday } from '../calendar/holidays';
import { isWeekend, toDate } from '../utils/date.utils';
import { SlaOptions } from '../types';

export class SlaBuilder {
  private options: Required<SlaOptions> = {
    state: 'BR',
    startHour: 8,
    endHour: 18,
    workHours: 8,
    data: new Date(),
    extraHolidays: []
  };

  constructor(init?: SlaOptions) {
    if (init) this.set(init);
  }

  public set(options: SlaOptions): this {
    this.options = { ...this.options, ...options, data: toDate(options.data ?? new Date()) };
    return this;
  }

  public state(state: string): this {
    this.options.state = state;
    return this;
  }

  public start(hour: number): this {
    this.options.startHour = hour;
    return this;
  }

  public end(hour: number): this {
    this.options.endHour = hour;
    return this;
  }

  public workHours(hours: number): this {
    this.options.workHours = hours;
    return this;
  }

  public date(date: string | Date): this {
    this.options.data = toDate(date);
    return this;
  }

  public extraHolidays(holidays: (string | Date)[]): this {
    this.options.extraHolidays = holidays;
    return this;
  }

  public isHoliday(): boolean {
    return isHoliday(this.options.data, this.options.state, this.options.extraHolidays);
  }

  public isWeekend(): boolean {
    return isWeekend(this.options.data);
  }

  public isBusinessDay(): boolean {
    return !this.isWeekend() && !this.isHoliday();
  }

  public calculate(): number {
    return this.isBusinessDay() ? this.options.workHours : 0;
  }
}