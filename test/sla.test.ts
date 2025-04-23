import { describe, it, expect } from "vitest";
import { TimeFlan } from "../src";

describe("TIMEFLAN Lib", () => {

  it("Validate if the Holidays are been retrieved", () => {
    const extraHolidays = [
      {
        name: "Extra Holiday",
        date: "2025-11-02",
      },
    ];
    const timeflan = TimeFlan().country("BR").state("SP").extraHolidays(extraHolidays);
    const holidays = timeflan.date('2025-01-01T00:00:00.000Z').getHolidays();
console.log(holidays);
    // National Holidays
    expect(holidays).toContain("2025-01-01T00:00:00.000Z"); // New Year's Day
    expect(holidays).toContain("2025-12-25T00:00:00.000Z"); // Christmas
    expect(holidays).toContain("2025-09-07T00:00:00.000Z"); // Independence Day
    expect(holidays).toContain("2025-04-20T00:00:00.000Z"); // Easter Sunday
    expect(holidays).toContain("2025-04-18T00:00:00.000Z"); // Good Friday
    expect(holidays).toContain("2025-06-19T00:00:00.000Z"); // Corpus Christi
    expect(holidays).toContain("2025-03-04T00:00:00.000Z"); // Carnival

    // State Holidays
    expect(holidays).toContain("2025-01-25T00:00:00.000Z");

    // Extra Holidays
    expect(holidays).toContain("2025-11-02T00:00:00.000Z");

    // Not BR holiday
    expect(holidays).not.toContain("2025-07-04T00:00:00.000Z"); // US Independence Day
  });

  it("Should validate holidays for multiple states", () => {
    const timeflanSC = TimeFlan().country("BR").state("SE");
    const holidaysSC = timeflanSC.date("2025-01-01").getHolidays();
    expect(holidaysSC).toContain("2025-07-08T00:00:00.000Z"); // SE State Holiday

    const timeflanSP = TimeFlan().country("BR").state("SP");
    const holidaysSP = timeflanSP.date("2025-01-01").getHolidays();
    expect(holidaysSP).toContain("2025-07-09T00:00:00.000Z"); // SP State Holiday
    expect(holidaysSP).not.toContain("2025-08-17T00:00:00.000Z"); // Not SC State Holiday
  });



  it('Should return True on holiday', () => {
    const extraHolidays = [{
      name: "Extra Holiday",
      date: "2025-11-02",
    },]
    const timeflan = TimeFlan().extraHolidays(extraHolidays).state('SC'); // Extra Holiday
    expect(timeflan.date('2025-12-25').isHoliday()).toBe(true);
    expect(timeflan.date('2025-01-01').isHoliday()).toBe(true);
    expect(timeflan.date('2025-11-02').isHoliday()).toBe(true); // Extra Holiday
    expect(timeflan.date('2025-07-04').isHoliday()).toBe(false); // US National Holiday
    expect(timeflan.date('2025-04-22').isHoliday()).toBe(false); // US National Holiday

    // Validate US Holiday
    const timeflanUS = TimeFlan().country('US').state('CA');
    expect(timeflanUS.date('2025-07-04').isHoliday()).toBe(true); // US Independence Day
    expect(timeflanUS.date('2025-11-11').isHoliday()).toBe(true); // Veteran's Day

  });

  it('Should detect if date is on weekend', () => {
    const timeflan = TimeFlan().date('2025-12-28'); // Sunday
    expect(timeflan.isWeekend()).toBe(true);
 
    const timeflan2 = TimeFlan().date('2025-04-22');
    expect(timeflan2.isWeekend()).toBe(false);
  });

  it('Should detect if is business Day', () => {
    const timeflan = TimeFlan().date('2025-04-22'); // Monday
    expect(timeflan.isBusinessDay()).toBe(true);

    const timeflan2 = TimeFlan().date('2025-12-25'); // Christmas
    expect(timeflan2.isBusinessDay()).toBe(false);

    const timeflan3 = TimeFlan().date('2025-04-26'); // Sunday
    expect(timeflan3.isBusinessDay()).toBe(false);
    
  });

  it('Calculate TIMEFLAN', () => {

    // // Menos de um dia de trabalho
    const timeflan = TimeFlan().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(4);
    expect(timeflan.calculate()).toBe('2025-12-22T12:00:00.000Z'); // 4 hours from 8 to 12

    // Um dia de trabalho
    const timeflan2 = TimeFlan().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(10);
    expect(timeflan2.calculate()).toBe('2025-12-22T18:00:00.000Z'); // 8 hours from 8 to 16

    // Dois dias de trabalho
    const timeflan3 = TimeFlan().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(20);
    expect(timeflan3.calculate()).toBe('2025-12-23T18:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day

    // Um dia e meio de trabalho
    const timeflan4 = TimeFlan().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(15);
    expect(timeflan4.calculate()).toBe('2025-12-23T13:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day + 4 hours on next day

    // Inicio no Feriado
    const timeflan5 = TimeFlan().date('2025-12-25T08:00:00.000Z').startHour(8).endHour(18).workHours(4);
    expect(timeflan5.calculate()).toBe('2025-12-26T12:00:00.000Z'); // 4 hours from 8 to 12 on next day

    // Inicio no final de semana
    const timeflan6 = TimeFlan().date('2025-04-26T08:00:00.000Z').startHour(8).endHour(18).workHours(4);
    expect(timeflan6.calculate()).toBe('2025-04-28T12:00:00.000Z'); // 4 hours from 8 to 12 on next day

    // Feriado no meio do prazo
    const timeflan7 = TimeFlan().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(30).extraHolidays([
      {
        name: "Extra Holiday",
        date: "2025-12-24",
      },
    ]);
    expect(timeflan7.calculate()).toBe('2025-12-26T18:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day + 4 hours on next day

    // Feriado no final do prazo
    const timeflan8 = TimeFlan().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(30).extraHolidays([
      {
        name: "Extra Holiday",
        date: "2025-12-24",
      },
      {
        name: "Extra Holiday",
        date: "2025-12-26",
      },
    ]);
    expect(timeflan8.calculate()).toBe('2025-12-29T18:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day + 4 hours on next day

    // Final de semana no final do prazo
    const timeflan9 = TimeFlan().date('2025-04-25T08:00:00.000Z').startHour(8).endHour(18).workHours(20);
    expect(timeflan9.calculate()).toBe('2025-04-28T18:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day

    // Final de semana no meio do prazo
    const timeflan10 = TimeFlan().date('2025-04-25T08:00:00.000Z').startHour(8).endHour(18).workHours(30);
    expect(timeflan10.calculate()).toBe('2025-04-29T18:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day + 4 hours on next day
  });

  it('Should calculate TIMEFLAN with different start and end hours', () => {

    const timeflan = TimeFlan().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(12).workHours(6);
    expect(timeflan.calculate()).toBe('2025-12-23T10:00:00.000Z'); // 4 hours from 8 to 12
  });

});
