import Period from '@/types/Period';

export const MONTHS: Array<Array<string>> = [
  ['January', 'Jan'],
  ['February', 'Feb'],
  ['March', 'Mar'],
  ['April', 'Apr'],
  ['May', 'May'],
  ['June', 'Jun'],
  ['July', 'Jul'],
  ['August', 'Aug'],
  ['September', 'Sep'],
  ['October', 'Oct'],
  ['November', 'Nov'],
  ['December', 'Dec'],
];

/**
 * Returns the index of the current month (0 - 11)
 */
export function getMonth(): number {
  return new Date().getMonth();
}

export function getMonthName(index?: number): string {
  const monthIndex = index ?? new Date().getMonth();
  return MONTHS[monthIndex][0];
}

export function getShortMonthName(index?: number): string {
  const monthIndex = index ?? new Date().getMonth();
  return MONTHS[monthIndex][1];
}

export function randomId() {
  // https://stackoverflow.com/a/8084248
  return (Math.random() + 1).toString(36).substring(2);
}

// TODO promote this to a class and add `publid toString = () : string => {}`
// export type Period = {
//   month: number;
//   year: number;
// };

// export function getPeriod(): Period {
//   const dt = new Date();
//   return {
//     month: dt.getMonth(),
//     year: dt.getFullYear(),
//   };
// }

// export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

export const transactionsKey = (period: Period) => `api/transactions?period=${period}`;
