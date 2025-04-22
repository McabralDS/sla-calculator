import { describe, it, expect } from "vitest";
import { Sla } from "../src";

describe("SLA Lib", () => {

  it("Validate if the Holidays are been retrieved", () => {
    const extraHolidays = [
      {
        name: "Extra Holiday",
        date: "2025-11-02",
      },
    ];
    const sla = Sla().country("BR").state("SP").extraHolidays(extraHolidays);
    const holidays = sla.date('2025-01-01T00:00:00.000Z').getHolidays();
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
    const slaSC = Sla().country("BR").state("SE");
    const holidaysSC = slaSC.date("2025-01-01").getHolidays();
    expect(holidaysSC).toContain("2025-07-08T00:00:00.000Z"); // SE State Holiday

    const slaSP = Sla().country("BR").state("SP");
    const holidaysSP = slaSP.date("2025-01-01").getHolidays();
    expect(holidaysSP).toContain("2025-07-09T00:00:00.000Z"); // SP State Holiday
    expect(holidaysSP).not.toContain("2025-08-17T00:00:00.000Z"); // Not SC State Holiday
  });



  it('Should return True on holiday', () => {
    const extraHolidays = [{
      name: "Extra Holiday",
      date: "2025-11-02",
    },]
    const sla = Sla().extraHolidays(extraHolidays).state('SC'); // Extra Holiday
    expect(sla.date('2025-12-25').isHoliday()).toBe(true);
    expect(sla.date('2025-01-01').isHoliday()).toBe(true);
    expect(sla.date('2025-11-02').isHoliday()).toBe(true); // Extra Holiday
    expect(sla.date('2025-07-04').isHoliday()).toBe(false); // US National Holiday
    expect(sla.date('2025-04-22').isHoliday()).toBe(false); // US National Holiday

    // Validate US Holiday
    const slaUS = Sla().country('US').state('CA');
    expect(slaUS.date('2025-07-04').isHoliday()).toBe(true); // US Independence Day
    expect(slaUS.date('2025-11-11').isHoliday()).toBe(true); // Veteran's Day

  });

  it('Should detect if date is on weekend', () => {
    const sla = Sla().date('2025-12-28'); // Sunday
    expect(sla.isWeekend()).toBe(true);
 
    const sla2 = Sla().date('2025-04-22');
    expect(sla2.isWeekend()).toBe(false);
  });

  it('Should detect if is business Day', () => {
    const sla = Sla().date('2025-04-22'); // Monday
    expect(sla.isBusinessDay()).toBe(true);

    const sla2 = Sla().date('2025-12-25'); // Christmas
    expect(sla2.isBusinessDay()).toBe(false);

    const sla3 = Sla().date('2025-04-26'); // Sunday
    expect(sla3.isBusinessDay()).toBe(false);
    
  });

  it('Calculate SLA', () => {

    // // Menos de um dia de trabalho
    const sla = Sla().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(4);
    expect(sla.calculateSla()).toBe('2025-12-22T12:00:00.000Z'); // 4 hours from 8 to 12

    // Um dia de trabalho
    const sla2 = Sla().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(10);
    expect(sla2.calculateSla()).toBe('2025-12-22T18:00:00.000Z'); // 8 hours from 8 to 16

    // Dois dias de trabalho
    const sla3 = Sla().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(20);
    expect(sla3.calculateSla()).toBe('2025-12-23T18:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day

    // Um dia e meio de trabalho
    const sla4 = Sla().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(15);
    expect(sla4.calculateSla()).toBe('2025-12-23T13:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day + 4 hours on next day

    // Inicio no Feriado
    const sla5 = Sla().date('2025-12-25T08:00:00.000Z').startHour(8).endHour(18).workHours(4);
    expect(sla5.calculateSla()).toBe('2025-12-26T12:00:00.000Z'); // 4 hours from 8 to 12 on next day

    // Inicio no final de semana
    const sla6 = Sla().date('2025-04-26T08:00:00.000Z').startHour(8).endHour(18).workHours(4);
    expect(sla6.calculateSla()).toBe('2025-04-28T12:00:00.000Z'); // 4 hours from 8 to 12 on next day

    // Feriado no meio do prazo
    const sla7 = Sla().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(30).extraHolidays([
      {
        name: "Extra Holiday",
        date: "2025-12-24",
      },
    ]);
    expect(sla7.calculateSla()).toBe('2025-12-26T18:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day + 4 hours on next day

    // Feriado no final do prazo
    const sla8 = Sla().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(18).workHours(30).extraHolidays([
      {
        name: "Extra Holiday",
        date: "2025-12-24",
      },
      {
        name: "Extra Holiday",
        date: "2025-12-26",
      },
    ]);
    expect(sla8.calculateSla()).toBe('2025-12-29T18:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day + 4 hours on next day

    // Final de semana no final do prazo
    const sla9 = Sla().date('2025-04-25T08:00:00.000Z').startHour(8).endHour(18).workHours(20);
    expect(sla9.calculateSla()).toBe('2025-04-28T18:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day

    // Final de semana no meio do prazo
    const sla10 = Sla().date('2025-04-25T08:00:00.000Z').startHour(8).endHour(18).workHours(30);
    expect(sla10.calculateSla()).toBe('2025-04-29T18:00:00.000Z'); // 8 hours from 8 to 16 + 12 hours on next day + 4 hours on next day
  });

  it('Should calculate SLA with different start and end hours', () => {

    const sla = Sla().date('2025-12-22T08:00:00.000Z').startHour(8).endHour(12).workHours(6);
    expect(sla.calculateSla()).toBe('2025-12-23T10:00:00.000Z'); // 4 hours from 8 to 12
  });

});
