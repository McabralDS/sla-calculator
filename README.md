# SLA Calculator

A powerful SLA (Service Level Agreement) calculator library built with TypeScript. This library allows you to calculate SLA deadlines while considering holidays (national and state-specific) and business days. It is highly customizable and supports extra holidays, different working hours, and multiple countries and states.

## Features

- **SLA Calculation**: Calculate SLA deadlines based on working hours and business days.
- **Holiday Support**: Includes national and state-specific holidays for Brazil and the United States.
- **Custom Holidays**: Add extra holidays specific to your organization or project.
- **Weekend Detection**: Automatically skips weekends when calculating SLA deadlines.
- **Business Day Validation**: Check if a given date is a business day.
- **Customizable Working Hours**: Define start and end working hours for SLA calculations.
- **Multi-country Support**: Currently supports Brazil (BR) and the United States (US).

## Installation

Install the library using `npm` or `pnpm`:

```bash
npm install sla-calculator
```

or 

```bash
pnpm add sla-calculator
``` 

## Usage
importing the Library

```
import { Sla } from 'sla-calculator'
```

Basic SLA Calculation

```
const sla = Sla()
  .country('BR')
  .state('SP')
  .startHour(8)
  .endHour(18)
  .workHours(16)
  .date('2025-12-22T08:00:00.000Z');

const result = sla.calculateSla();
console.log(result); // Outputs the SLA deadline considering holidays and weekends
```

Checking if a Date is a Holiday
```
const sla = Sla().country('BR').state('SC');
const isHoliday = sla.date('2025-12-25').isHoliday();
console.log(isHoliday); // true (Christmas)
```

Adding Extra Holidays
```
const extraHolidays = [
  { name: 'Company Anniversary', date: '2025-11-02' },
];

const sla = Sla().extraHolidays(extraHolidays);
const holidays = sla.getHolidays();
console.log(holidays); // Includes the extra holiday
```

Checking if a Date is a Business Day
```
const sla = Sla().date('2025-12-25'); // Christmas
console.log(sla.isBusinessDay()); // false
```

Detecting Weekends

```
const sla = Sla().date('2025-12-28'); // Sunday
console.log(sla.isWeekend()); // true
```


## API Reference
`Sla(options?: SlaOptions)`

Creates a new SLA calculator instance.

### Options
- `country` (string): Country code (e.g., 'BR' for Brazil).
- `state` (string): State code (e.g., 'SP' for São Paulo).
- `startHour` (number): Start of the working day (e.g., 8 for 8:00 AM).
- `endHour` (number): End of the working day (e.g., 18 for 6:00 PM).
- `workHours` (number): Total working hours for the SLA.
- `date` (string | Date): Start date for the SLA calculation.
- `extraHolidays` (Holiday[]): Array of additional holidays.

### Methods
- `country(country: string): this`: Sets the country.
- `state(state: string): this`: Sets the state.
- `startHour(hour: number): this`: Sets the start hour.
- `endHour(hour: number): this`: Sets the end hour.
- `workHours(hours: number): this`: Sets the total working hours.
- `date(date: string | Date): this`: Sets the start date.
- `extraHolidays(holidays: Holiday[]): this`: Adds extra holidays.
- `isHoliday(date?: string | Date): boolean`: Checks if a date is a holiday.
- `getHolidays(date?: string | Date): string[]`: Retrieves all holidays for the year.
- `isWeekend(date?: string | Date): boolean`: Checks if a date is a weekend.
- `isBusinessDay(date?: string | Date): boolean`: Checks if a date is a business day.
- `calculateSla(): string`: Calculates the SLA deadline.

## Supported Countries and States
Brazil (BR)
- National holidays
- State-specific holidays (e.g., São Paulo, Santa Catarina)

United States (US)
- National holidays
- State-specific holidays (e.g., California)

## Inspiration
This library was inspired by the project eh-dia-util by lfreneda, which provides utilities for working with business days and holidays in Brazil.

## Development
Running Tests
The library uses Vitest for testing. To run the tests:
```bash
npm test
```

or
```bash
pnpm test
```

Building the Library
To build the library:
```bash
npm run build
```

or
```bash
pnpm run build
```


## License
This project is licensed under the MIT License. See the LICENSE file for details.

---
### Developed by Mateus Cabral dos Santos

[GitHub Profile - McabralDS](https://github.com/McabralDS)
