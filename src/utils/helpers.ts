export const MONTHS: Array<Array<string>> = [
  ["January", "Jan"],
  ["February", "Feb"],
  ["March", "Mar"],
  ["April", "Apr"],
  ["May", "May"],
  ["June", "Jun"],
  ["July", "Jul"],
  ["August", "Aug"],
  ["September", "Sep"],
  ["October", "Oct"],
  ["November", "Nov"],
  ["December", "Dec"],
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
