export const transactionTypes = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER',
} as const;

export type TransactionType = typeof transactionTypes[keyof typeof transactionTypes];
