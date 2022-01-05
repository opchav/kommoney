import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';

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
   * Returns the first day of the month for the period
   */
  firstDay() {
    const tempDate = new Date(`${this}-07T07:07:07`);
    return startOfMonth(tempDate);
  }

  /**
   * Returns the last day of the month for the period
   * The hour is set to 23:59:59 to ensure it includes the whole month
   */
  lastDay() {
    const tempDate = new Date(`${this}-07T07:07:07`);
    return endOfMonth(tempDate);
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
    return `${this.year}-${this.month}`;
  }
}
