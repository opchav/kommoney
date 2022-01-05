import Period from './Period';

describe('Period', () => {
  describe('when not valid', () => {
    it('should throw if month < 0', () => {
      expect(() => new Period(-1, 2021)).toThrow(/month -1 is invalid/i);
    });
    it('should throw if month > 11', () => {
      expect(() => new Period(12, 2021)).toThrow(/month 12 is invalid/i);
    });
    it('should throw if year < 2001', () => {
      expect(() => new Period(10, 2000)).toThrow(/the given year 2000 is not supported/i);
    });
    it('should throw if year > 2099', () => {
      expect(() => new Period(10, 2100)).toThrow(/the given year 2100 is not supported/i);
    });
  });
  describe('when valid', () => {
    describe('with no parameters', () => {
      it(`should have month and year equal to today's date`, () => {
        const today = new Date();
        const period = new Period();
        expect(period.month).toBe(today.getMonth());
        expect(period.year).toBe(today.getFullYear());
      });
    });
    describe('with month as parameter only', () => {
      it(`should have the current year and given month`, () => {
        const period = new Period(2);
        expect(period.month).toBe(2);
        expect(period.year).toBe(new Date().getFullYear());
      });
    });
    describe('with year as parameter only', () => {
      it(`should have the current month and given year`, () => {
        const period = new Period(undefined, 2010);
        expect(period.month).toBe(new Date().getMonth());
        expect(period.year).toBe(2010);
      });
    });
    describe('with month and year as parameter', () => {
      it(`should have the given month and given year`, () => {
        const period = new Period(1, 2021);
        expect(period.month).toBe(1);
        expect(period.year).toBe(2021);
      });
    });
    describe('when given a YYYY-MM formatted string', () => {
      it(`should created a period if give value is "2021-03"`, () => {
        const period = Period.fromYearMonth('2021-03');
        expect(period.month).toBe(2);
        expect(period.year).toBe(2021);
      });
      it(`should throw error for invalid month "2021-13"`, () => {
        expect(() => Period.fromYearMonth('2021-13')).toThrow(Error);
      });
      it(`should throw error for invalid month "2000-01"`, () => {
        expect(() => Period.fromYearMonth('2000-01')).toThrow(Error);
      });
      it(`should throw error for invalid format given "invalid"`, () => {
        expect(() => Period.fromYearMonth('invalid')).toThrow(/period not valid/i);
      });
    });
  });

  describe('.toString', () => {
    const period = new Period(1, 2021);
    it('should return 2021-02 as string', () => {
      expect(period.toString()).toBe('2021-02');
    });
  });

  describe('.toMonthName', () => {
    const period = new Period(1, 2021);
    it(`should return "February, 2021" when month = 1 and year = 2021`, () => {
      expect(period.toMonthName()).toBe('February, 2021');
    });
  });

  describe('.toShortMonthName', () => {
    const period = new Period(7, 2019);
    it(`should return "Aug, 2019" when month = 7 and year = 2019`, () => {
      expect(period.toShortMonthName()).toBe('Aug, 2019');
    });
  });

  describe('.getMonthName', () => {
    const period = new Period(10, 2019);
    it(`should return "November" when month = 10`, () => {
      expect(period.getMonthName()).toBe('November');
    });
  });

  describe('.getShortMonthName', () => {
    const period = new Period(10, 2019);
    it(`should return "Nov" when month = 10`, () => {
      expect(period.getShortMonthName()).toBe('Nov');
    });
  });

  describe('.firstDay', () => {
    describe('when period is March, 2020', () => {
      const period = new Period(2, 2020);
      it(`should return 1 as first day`, () => {
        expect(period.firstDay().getDate()).toBe(1);
      });
      it(`should have iso date = "2020-03-01T00:00:00"`, () => {
        expect(period.firstDayAsISO()).toMatch(/2020-03-01T00:00:00/i);
      });
    });
  });

  describe('.lastDay', () => {
    describe('when period is February, 2020', () => {
      const period = new Period(1, 2020);
      it(`should return 29 as last day`, () => {
        expect(period.lastDay().getDate()).toBe(29);
      });
      it(`should have iso date = "2020-02-29T23:59:59"`, () => {
        expect(period.lastDayAsISO()).toMatch(/2020-02-29T23:59:59/i);
      });
    });
  });

  describe('.getPreviousPeriod', () => {
    describe('when period is September, 2020', () => {
      const period = new Period(8, 2020);
      it(`should return "August, 2020" as the previous period`, () => {
        expect(period.getPreviousPeriod().toString()).toBe('2020-08');
      });
    });
    describe('when period is January, 2001', () => {
      const period = new Period(0, 2001);
      it(`should throw error as the year 2000 is not supported`, () => {
        expect(() => period.getPreviousPeriod()).toThrow(Error);
      });
    });
  });

  describe('.getNextPeriod', () => {
    describe('when period is September, 2020', () => {
      const period = new Period(8, 2020);
      it(`should return "October, 2020" as the next period`, () => {
        expect(period.getNextPeriod().toString()).toBe('2020-10');
      });
    });
    describe('when period is December, 2099', () => {
      const period = new Period(11, 2099);
      it(`should throw error as the year 2100 is not supported`, () => {
        expect(() => period.getNextPeriod()).toThrow(Error);
      });
    });
  });
});
