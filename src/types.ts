export interface TimeFlanOptions {
  country?: string;
  state?: string;
  startHour?: number;
  endHour?: number;
  workHours?: number;
  date?: string | Date;
  extraHolidays?: Holiday[];
}

export type HolidayByCountry = {
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

