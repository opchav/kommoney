export interface Transaction {
  title: string;
  value: number;
  type: "income" | "expense";
  date: number;
  paid: number;
  category: string;
  account: string;
  note: string;
}
