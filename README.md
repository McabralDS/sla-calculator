<p align="center">
  <a href="https://github.com/McabralDS/time-flan">
    <img src="https://raw.githubusercontent.com/McabralDS/time-flan/main/time-flan.png" alt="Time Flan" width="300"/>
  </a>
</p>

# Time Flan

**Time Flan** is a smart business time calculator library written in TypeScript. It provides flexible and accurate time calculations by taking holidays, weekends, and custom working hours into account. Perfect for SLA estimations, deadline validation, or any scenario where *working time awareness* is essential.

---

## ✨ Features

- 📅 **Holiday Awareness**: Supports national and regional holidays (Brazil and USA).
- 📆 **Weekend Detection**: Skips Saturdays and Sundays automatically.
- 🚫 **Non-Working Days**: Check if a date is a business day or a holiday.
- ⏱️ **Smart SLA Estimation**: Calculate deadlines based on working hours, including custom schedules.
- 🧩 **Custom Holidays**: Add your own dates like company anniversaries or one-off breaks.
- 🕒 **Configurable Working Hours**: Define working start/end times for accurate calculations.
- 🌎 **Multi-Country Support**: Out-of-the-box for `BR` (Brazil) and `US` (United States).

---

## 📦 Installation

```bash
npm install time-flan
# or
pnpm add time-flan
```

---

## 🚀 Usage

### Importing

```ts
import { TimeFlan } from 'time-flan';
```

---

### SLA Calculation

```ts
const result = TimeFlan()
  .country('BR')
  .state('SP')
  .startHour(8)
  .endHour(18)
  .workHours(16)
  .date('2025-12-22T08:00:00.000Z')
  .calculate();

console.log(result); // Outputs the SLA deadline considering holidays and weekends
```

---

### Check if a Date is a Holiday

```ts
const isHoliday = TimeFlan()
  .country('BR')
  .state('SC')
  .date('2025-12-25')
  .isHoliday();

console.log(isHoliday); // true (Christmas)
```

---

### Add Extra Holidays

```ts
const extraHolidays = [
  { name: 'Company Anniversary', date: '2025-11-02' },
];

const holidays = TimeFlan()
  .extraHolidays(extraHolidays)
  .getHolidays();

console.log(holidays);
```

---

### Check if a Date is a Business Day

```ts
const isBusiness = TimeFlan()
  .date('2025-12-25')
  .isBusinessDay();

console.log(isBusiness); // false
```

---

### Detect Weekend

```ts
const isWeekend = TimeFlan()
  .date('2025-12-28')
  .isWeekend();

console.log(isWeekend); // true
```

---

## 🧩 API Reference

### `TimeFlan(options?: TimeFlanOptions)`

Creates a new instance.

#### Options:

- `country` (string) – ISO country code (e.g. `'BR'`)
- `state` (string) – Region/state code (e.g. `'SP'`)
- `startHour` (number) – Start of working day (0-23)
- `endHour` (number) – End of working day (0-23)
- `workHours` (number) – Total hours of work
- `date` (string | Date) – Initial date for calculation
- `extraHolidays` (Holiday[]) – Additional holidays

#### Methods:

- `country(code: string): this`
- `state(code: string): this`
- `startHour(hour: number): this`
- `endHour(hour: number): this`
- `workHours(hours: number): this`
- `date(date: string | Date): this`
- `extraHolidays(holidays: Holiday[]): this`
- `isHoliday(date?: string | Date): boolean`
- `isWeekend(date?: string | Date): boolean`
- `isBusinessDay(date?: string | Date): boolean`
- `getHolidays(): Holiday[]`
- `calculate(): string`

---

## 🌍 Supported Locations

### Brazil (`BR`)
- National holidays
- State-specific holidays (e.g. São Paulo, Santa Catarina)

### United States (`US`)
- National holidays
- State-specific holidays (e.g. California)

---

## 🧪 Development

### Run tests

```bash
npm test
# or
pnpm test
```

> Uses **Vitest** under the hood.

### Build

```bash
npm run build
# or
pnpm run build
```

---

## 🙌 Credits

Inspired by the project [eh-dia-util](https://github.com/lfreneda/eh-dia-util) by [lfreneda](https://github.com/lfreneda).

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

### Developed by [Mateus Cabral dos Santos](https://github.com/McabralDS)

---

## 📦 GitHub

Find this project on GitHub: [https://github.com/McabralDS/time-flan](https://github.com/McabralDS/time-flan)

---
