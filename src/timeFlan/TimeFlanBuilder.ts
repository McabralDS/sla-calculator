import { isHoliday, getHolidays } from "../calendar/holidays";
import { isWeekend, toDate, createUtcDateWithHour } from "../utils/date.utils";
import { Holiday, TimeFlanOptions } from "../types";

export class TimeFlanBuilder {
  private options: Required<TimeFlanOptions> = {
    country: "BR",
    state: "SC",
    startHour: 8,
    endHour: 18,
    workHours: 8,
    date: toDate(new Date()),
    extraHolidays: [],
  };

  constructor(init?: TimeFlanOptions) {
    if (init) this.set(init);
  }

  public set(options: TimeFlanOptions): this {
    this.options = {
      ...this.options,
      ...options,
      date: toDate(options.date ?? new Date()),
    };
    return this;
  }

  public country(country: string): this {
    this.options.country = country;
    return this;
  }

  public state(state: string): this {
    this.options.state = state;
    return this;
  }

  public startHour(hour: number): this {
    if (hour < 0 || hour > 23) {
      throw new Error("Start hour must be between 0 and 23.");
    }
    this.options.startHour = hour;
    return this;
  }

  public endHour(hour: number): this {
    if (hour < 0 || hour > 23) {
      throw new Error("End hour must be between 0 and 23.");
    }
    this.options.endHour = hour;
    return this;
  }

  public workHours(hours: number): this {
    if (hours < 0) {
      throw new Error("Work hours must be a positive number.");
    }
    this.options.workHours = hours;
    return this;
  }

  public date(date: string | Date): this {
    this.options.date = toDate(date);
    return this;
  }

  public extraHolidays(holidays: Holiday[]): this {
    this.options.extraHolidays = holidays;
    return this;
  }

  public isHoliday(date?: string | Date): boolean {
    const data = date ? toDate(date) : this.options.date;
    return isHoliday(
      data,
      this.options.country,
      this.options.state,
      this.options.extraHolidays
    );
  }

  public getHolidays(date?: string | Date): string[] {
    const data = date ? toDate(date) : toDate(this.options.date);
    const year = data.getUTCFullYear();

    return getHolidays(
      this.options.country,
      this.options.state,
      year,
      this.options.extraHolidays
    );
  }

  public isWeekend(date?: string | Date): boolean {
    const data = date ? toDate(date) : this.options.date;
    return isWeekend(toDate(data));
  }

  public isBusinessDay(date?: string | Date): boolean {
    const data = date ? toDate(date) : this.options.date;
    return !this.isWeekend(data) && !this.isHoliday(data);
  }

  public nextBusinessDay(date?: string | Date): Date {
    const data = date ? toDate(date) : this.options.date;
    let nextDate = new Date(data);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);

    while (!this.isBusinessDay(nextDate)) {
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    }

    return nextDate;
  }

  public calculate(): string {
    const { date, workHours, startHour, endHour } = this.options;
    const startDate = toDate(date);
    let remainingHours = workHours;
    let currentDate = new Date(startDate);
  
    // Ajuste para começar no próximo dia útil válido
    if(!this.isBusinessDay(currentDate)) {
      currentDate = this.nextBusinessDay(currentDate);
    }
    
    // Se for dia útil, garante que começa no horário de início
    if (currentDate.getUTCHours() < startHour) {
      currentDate.setUTCHours(startHour, 0, 0, 0);
    }
  
    while (remainingHours > 0) {
      if (this.isBusinessDay(currentDate)) {

        const workDayStart = createUtcDateWithHour(currentDate, startHour);

        const workDayEnd = createUtcDateWithHour(currentDate, endHour);
  
        if (currentDate < workDayStart) {
          currentDate = new Date(workDayStart);
        }
  
        if (currentDate >= workDayEnd) {
          currentDate = createUtcDateWithHour(currentDate, startHour, 1);
          continue;
        }
  
        const millisAvailable = workDayEnd.getTime() - currentDate.getTime();
        const hoursAvailable = millisAvailable / (1000 * 60 * 60);
  
        if (hoursAvailable >= remainingHours) {
          currentDate = new Date(currentDate.getTime() + remainingHours * 60 * 60 * 1000);
          remainingHours = 0;
        } else {
          remainingHours -= hoursAvailable;
          currentDate = createUtcDateWithHour(currentDate, startHour, 1);
        }
      } else {
        currentDate = createUtcDateWithHour(currentDate, startHour, 1);
      }
    }
  
    return currentDate.toISOString();
  } 
}