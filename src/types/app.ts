export const transactionTypes = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER',
} as const;

export type TransactionType = typeof transactionTypes[keyof typeof transactionTypes];

export interface Transaction {
  id?: string;
  description: string;
  value: number;
  type: TransactionType;
  txDate: Date;
  paid: boolean;
  // TODO rely on categoryId and txAccountId. To get name search the cache for these models
  categoryId: string;
  txAccountId: string;
  note?: string;
}

export type TransactionInput = {
  value: number;
  title: string;
  paid: boolean;
  txDate: Date;
  categoryId: string;
  txAccountId: string;
  type: TransactionType;
};

export const categoryTypes = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export type CategoryType = typeof categoryTypes[keyof typeof categoryTypes];

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
};

export const txAccountTypes = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
} as const;

export type TxAccountType = typeof txAccountTypes[keyof typeof txAccountTypes];

export type TxAccount = {
  id: string;
  name: string;
  balance: number;
  type: TxAccountType;
  color?: string;
  icon?: string;
};
