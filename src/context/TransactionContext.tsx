import * as React from "react";
import { Transaction } from "../types/transaction";

const transactions: Array<Transaction> = [];
const setTransactions: React.Dispatch<
  React.SetStateAction<Transaction[]>
> = () => {};

export const TransactionContext = React.createContext({
  transactions,
  setTransactions,
});
