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
});
