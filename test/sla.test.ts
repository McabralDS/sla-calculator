import { describe, it, expect } from "vitest";
import { TimeFlan } from "../src";

describe("TimeFlan", () => {
  describe("Feriados", () => {
    it("deve retornar feriados nacionais, estaduais e extras", () => {
      const extras = [{ name: "Extra Holiday", date: "2025-11-02" }];
      const timeflan = TimeFlan().country("BR").state("SP").extraHolidays(extras);
      const holidays = timeflan.date('2025-01-01T00:00:00.000Z').getHolidays();

      expect(holidays).toEqual(expect.arrayContaining([
        "2025-01-01T00:00:00.000Z", // Ano Novo
        "2025-12-25T00:00:00.000Z", // Natal
        "2025-09-07T00:00:00.000Z", // Independência
        "2025-04-20T00:00:00.000Z", // Páscoa
        "2025-04-18T00:00:00.000Z", // Sexta-feira Santa
        "2025-06-19T00:00:00.000Z", // Corpus Christi
        "2025-03-04T00:00:00.000Z", // Carnaval
        "2025-01-25T00:00:00.000Z", // SP
        "2025-11-02T00:00:00.000Z", // Extra
      ]));
      expect(holidays).not.toContain("2025-07-04T00:00:00.000Z");
    });

    it("deve diferenciar feriados estaduais", () => {
      const holidaysSE = TimeFlan().country("BR").state("SE").date("2025-01-01").getHolidays();
      const holidaysSP = TimeFlan().country("BR").state("SP").date("2025-01-01").getHolidays();

      expect(holidaysSE).toContain("2025-07-08T00:00:00.000Z");
      expect(holidaysSP).toContain("2025-07-09T00:00:00.000Z");
      expect(holidaysSP).not.toContain("2025-08-17T00:00:00.000Z");
    });

    it("deve detectar se uma data é feriado", () => {
      const extras = [{ name: "Extra Holiday", date: "2025-11-02" }];
      const timeflan = TimeFlan().state("SC").extraHolidays(extras);

      expect(timeflan.date("2025-12-25").isHoliday()).toBe(true);
      expect(timeflan.date("2025-01-01").isHoliday()).toBe(true);
      expect(timeflan.date("2025-11-02").isHoliday()).toBe(true);
      expect(timeflan.date("2025-07-04").isHoliday()).toBe(false);
      expect(timeflan.date("2025-04-22").isHoliday()).toBe(false);

      const timeflanUS = TimeFlan().country("US").state("CA");
      expect(timeflanUS.date("2025-07-04").isHoliday()).toBe(true);
      expect(timeflanUS.date("2025-11-11").isHoliday()).toBe(true);
    });
  });

  describe("Fins de semana e dias úteis", () => {
    it("deve detectar fins de semana", () => {
      expect(TimeFlan().date("2025-12-28").isWeekend()).toBe(true);
      expect(TimeFlan().date("2025-04-22").isWeekend()).toBe(false);
    });

    it("deve detectar dias úteis", () => {
      expect(TimeFlan().date("2025-04-22").isBusinessDay()).toBe(true);
      expect(TimeFlan().date("2025-12-25").isBusinessDay()).toBe(false);
      expect(TimeFlan().date("2025-04-26").isBusinessDay()).toBe(false);
    });
  });

  describe("Cálculo de prazo com TIMEFLAN", () => {
    it("deve calcular prazo com base em horas de trabalho", () => {
      expect(TimeFlan().date("2025-12-22T08:00:00Z").startHour(8).endHour(18).workHours(4).calculate())
        .toBe("2025-12-22T12:00:00.000Z");

      expect(TimeFlan().date("2025-12-22T08:00:00Z").startHour(8).endHour(18).workHours(10).calculate())
        .toBe("2025-12-22T18:00:00.000Z");

      expect(TimeFlan().date("2025-12-22T08:00:00Z").startHour(8).endHour(18).workHours(20).calculate())
        .toBe("2025-12-23T18:00:00.000Z");

      expect(TimeFlan().date("2025-12-22T08:00:00Z").startHour(8).endHour(18).workHours(15).calculate())
        .toBe("2025-12-23T13:00:00.000Z");
    });

    it("deve ignorar feriados e fins de semana ao iniciar", () => {
      expect(TimeFlan().date("2025-12-25T08:00:00Z").startHour(8).endHour(18).workHours(4).calculate())
        .toBe("2025-12-26T12:00:00.000Z");

      expect(TimeFlan().date("2025-04-26T08:00:00Z").startHour(8).endHour(18).workHours(4).calculate())
        .toBe("2025-04-28T12:00:00.000Z");
    });

    it("deve ignorar feriados e fins de semana no meio do prazo", () => {
      const extras = [{ name: "Extra Holiday", date: "2025-12-24" }];
      const extras2 = [...extras, { name: "Extra Holiday", date: "2025-12-26" }];

      expect(TimeFlan().date("2025-12-22T08:00:00Z").startHour(8).endHour(18).workHours(30).extraHolidays(extras).calculate())
        .toBe("2025-12-26T18:00:00.000Z");

      expect(TimeFlan().date("2025-12-22T08:00:00Z").startHour(8).endHour(18).workHours(30).extraHolidays(extras2).calculate())
        .toBe("2025-12-29T18:00:00.000Z");

      expect(TimeFlan().date("2025-04-25T08:00:00Z").startHour(8).endHour(18).workHours(20).calculate())
        .toBe("2025-04-28T18:00:00.000Z");

      expect(TimeFlan().date("2025-04-25T08:00:00Z").startHour(8).endHour(18).workHours(30).calculate())
        .toBe("2025-04-29T18:00:00.000Z");
    });

    it("deve considerar horários de início e fim diferentes", () => {
      expect(TimeFlan().date("2025-12-22T08:00:00Z").startHour(8).endHour(12).workHours(6).calculate())
        .toBe("2025-12-23T10:00:00.000Z");
    });

    it("deve lidar com casos de borda envolvendo feriados e finais de semana", () => {
      expect(TimeFlan().date("2025-12-25T08:00:00Z").startHour(8).endHour(18).workHours(20).calculate())
        .toBe("2025-12-29T18:00:00.000Z");

      const extras = [{ name: "Extra Holiday", date: "2025-12-29" }];
      expect(TimeFlan().date("2025-12-27T08:00:00Z").startHour(8).endHour(18).workHours(20).extraHolidays(extras).calculate())
        .toBe("2025-12-31T18:00:00.000Z");
    });
  });
});
