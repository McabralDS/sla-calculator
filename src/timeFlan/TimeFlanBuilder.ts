import { isHoliday, getHolidays } from "../calendar/holidays";
import { isWeekend, toDate } from "../utils/date.utils";
import { Holiday, TimeFlanOptions } from "../types";

export class TimeFlanBuilder {
  private options: Required<TimeFlanOptions> = {
    country: "BR",
    state: "SC",
    startHour: 8,
    endHour: 18,
    workHours: 8,
    data: toDate(new Date()),
    extraHolidays: [],
  };

  constructor(init?: TimeFlanOptions) {
    if (init) this.set(init);
  }

  public set(options: TimeFlanOptions): this {
    this.options = {
      ...this.options,
      ...options,
      data: toDate(options.data ?? new Date()),
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
    this.options.data = toDate(date);
    return this;
  }

  public extraHolidays(holidays: Holiday[]): this {
    this.options.extraHolidays = holidays;
    return this;
  }

  public isHoliday(date?: string | Date): boolean {
    const data = date ? toDate(date) : this.options.data;
    return isHoliday(
      data,
      this.options.country,
      this.options.state,
      this.options.extraHolidays
    );
  }

  public getHolidays(date?: string | Date): string[] {
    const data = date ? toDate(date) : toDate(this.options.data);
    const year = data.getUTCFullYear();

    return getHolidays(
      this.options.country,
      this.options.state,
      year,
      this.options.extraHolidays
    );
  }

  public isWeekend(date?: string | Date): boolean {
    const data = date ? toDate(date) : this.options.data;
    return isWeekend(toDate(data));
  }

  public isBusinessDay(date?: string | Date): boolean {
    const data = date ? toDate(date) : this.options.data;
    return !this.isWeekend(data) && !this.isHoliday(data);
  }

  public nextBusinessDay(date?: string | Date): Date {
    const data = date ? toDate(date) : this.options.data;
    let nextDate = new Date(data);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);

    while (!this.isBusinessDay(nextDate)) {
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    }

    return nextDate;
  }

  public calculate(): string {
    const { data, workHours, startHour, endHour } = this.options;
    const startDate = toDate(data);
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
        const workDayStart = new Date(Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          startHour
        ));
  
        const workDayEnd = new Date(Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          endHour
        ));
  
        if (currentDate < workDayStart) {
          currentDate = new Date(workDayStart);
        }
  
        if (currentDate >= workDayEnd) {
          currentDate = new Date(Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate() + 1,
            startHour
          ));
          continue;
        }
  
        const millisAvailable = workDayEnd.getTime() - currentDate.getTime();
        const hoursAvailable = millisAvailable / (1000 * 60 * 60);
  
        if (hoursAvailable >= remainingHours) {
          currentDate = new Date(currentDate.getTime() + remainingHours * 60 * 60 * 1000);
          remainingHours = 0;
        } else {
          remainingHours -= hoursAvailable;
          currentDate = new Date(Date.UTC(
            currentDate.getUTCFullYear(),
            currentDate.getUTCMonth(),
            currentDate.getUTCDate() + 1,
            startHour
          ));
        }
      } else {
        currentDate = new Date(Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate() + 1,
          startHour
        ));
      }
    }
  
    return currentDate.toISOString();
  } 
}