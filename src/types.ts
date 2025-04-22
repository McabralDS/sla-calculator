export interface SlaOptions {
  contry?: string;
  state?: string;
  startHour?: number;
  endHour?: number;
  workHours?: number;
  data?: string | Date;
  extraHolidays?: Holiday[];
}

export type HolidayByContry = {
  [countryCode: string]: {
    national: Holiday[];
    state?: HolidayByState;
  };
};

export type HolidayByState = {
  [stateCode: string]: Holiday[];
};

export type Holiday = {
  name: string;
  date: string;
};

