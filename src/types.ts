export interface SlaOptions {
    state?: string;
    startHour?: number;
    endHour?: number;
    workHours?: number;
    data?: string | Date;
    extraHolidays?: (string | Date)[];
  }