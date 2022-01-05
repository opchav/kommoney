import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import formatISO from 'date-fns/formatISO';

export const MONTHS: Array<Record<string, string>> = [
  { full: 'January', short: 'Jan' },
  { full: 'February', short: 'Feb' },
  { full: 'March', short: 'Mar' },
  { full: 'April', short: 'Apr' },
  { full: 'May', short: 'May' },
  { full: 'June', short: 'Jun' },
  { full: 'July', short: 'Jul' },
  { full: 'August', short: 'Aug' },
  { full: 'September', short: 'Sep' },
  { full: 'October', short: 'Oct' },
  { full: 'November', short: 'Nov' },
  { full: 'Dec', short: 'Dec' },
];

export default class Period {
  readonly month: number;
  readonly year: number;

  constructor(month?: number, year?: number) {
    if (!!month) this.ensureValidMonth(month);
    if (!!year) this.ensureValidYear(year);

    const now = new Date();

    this.month = !!month ? month : now.getMonth();
    this.year = !!year ? year : now.getFullYear();
  }

  /**
   * Creates a period given a YYYY-MM formatted string
   */
  static fromYearMonth(value: string): Period {
    if (!value.trim() || !/\d{4}-\d{1,2}$/.test(value)) {
      throw new Error('Period not valid. It should be formatted YYYY-MM');
    }

    const [year, month] = value.split('-');
    return new Period(parseInt(month) - 1, parseInt(year));
  }

  /**
   * Returns the first day of the month for the period
   */
  firstDay() {
    const tempDate = new Date(`${this}-07T07:07:07`);
    return startOfMonth(tempDate);
  }

  firstDayAsISO() {
    const tempDate = new Date(`${this}-07T07:07:07`);
    return formatISO(startOfMonth(tempDate));
  }

  /**
   * Returns the last day of the month for the period
   * The hour is set to 23:59:59 to ensure it includes the whole month
   */
  lastDay() {
    const tempDate = new Date(`${this}-07T07:07:07`);
    return endOfMonth(tempDate);
  }

  lastDayAsISO() {
    const tempDate = new Date(`${this}-07T07:07:07`);
    return formatISO(endOfMonth(tempDate));
  }

  /**
   * Returns the period formatted with full month name and year as number
   * Eg.: {month: 0, year: 2020} = January, 2022
   */
  toMonthName() {
    return `${MONTHS[this.month].full}, ${this.year}`;
  }

  /**
   * Returns the period formatted with short month name and year as number
   * Eg.: {month: 0, year: 2020} = Jan, 2022
   */
  toShortMonthName() {
    return `${MONTHS[this.month].short}, ${this.year}`;
  }

  getMonthName() {
    return MONTHS[this.month].full;
  }

  getShortMonthName() {
    return MONTHS[this.month].short;
  }

  getNextPeriod() {
    let month = this.month;
    let year = this.year;

    if (month === 11) {
      if (this.year === 2099) {
        throw new Error('Sorry, 2099 is the max year supported'); // XD
      }
      month = 0;
      year++;
    } else {
      month += 1;
    }

    return new Period(month, year);
  }

  getPreviousPeriod() {
    let month = this.month;
    let year = this.year;

    if (month === 0) {
      if (this.year === 2001) {
        throw new Error('Sorry, 2001 is the min year supported'); // XD
      }
      month = 11;
      year--;
    } else {
      month -= 1;
    }

    return new Period(month, year);
  }

  ensureValidMonth(month: number) {
    if (month < 0 || month > 11) {
      throw new Error(`Month ${month} is invalid. It should be between 0 and 11`);
    }
  }

  ensureValidYear(year: number) {
    // This app is only meant to be used in this century. I'm sorry people from the far future.
    if (year < 2001 || year > 2099) {
      throw new Error(
        `The given year ${year} is not supported. It should be between 2001 and 2099`,
      );
    }
  }

  toString() {
    const month = `${this.month + 1}`.padStart(2, '0');
    return `${this.year}-${month}`;
  }
}
