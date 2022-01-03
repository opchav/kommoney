export interface Transaction {
  id: string;
  title: string;
  value: number;
  type: TransactionType;
  date: number;
  paid: number;
  category: string;
  account: string;
  note: string;
}

export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
  TRANSFER = 'transfer',
}
