import * as React from "react";
import { Transaction } from "../types/transaction";
import { randomId } from "../utils/helpers";

type ActionType = {
  type: "addTransaction" | "removeTransaction";
  payload: Transaction;
};

export const TransactionsContext = React.createContext<Transaction[]>([]);
export const TrnansactionsDispatchContext = React.createContext<
  React.Dispatch<ActionType>
>(() => {});

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, dispatch] = React.useReducer(
    transactionsReducer,
    initialTransactions
  );

  return (
    <TransactionsContext.Provider value={transactions}>
      <TrnansactionsDispatchContext.Provider value={dispatch}>
        {children}
      </TrnansactionsDispatchContext.Provider>
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  return React.useContext(TransactionsContext);
}

export function useTransactionsDispatch() {
  return React.useContext(TrnansactionsDispatchContext);
}

function transactionsReducer(state: Transaction[], action: ActionType) {
  switch (action.type) {
    case "addTransaction": {
      action.payload.id = randomId();
      return [...state, action.payload];
    }
    case "removeTransaction": {
      return state.filter((tx) => tx.id !== action.payload.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

function createTransaction(
  title: string,
  value: number,
  type: "income" | "expense",
  date: number,
  paid: number,
  category: string,
  account: string,
  note: string
): Transaction {
  return {
    id: randomId(),
    title,
    value,
    type,
    date,
    paid,
    category,
    account,
    note,
  };
}

const now = new Date().getTime();
const initialTransactions = [
  createTransaction("Hamburger", 25, "expense", now, 1, "2", "1", ""),
  createTransaction("Pizza", 50, "expense", now, 1, "1", "1", ""),
  createTransaction("iPhone 13", 6999, "expense", now, 1, "1", "1", ""),
  createTransaction("Rice 2kg", 19, "expense", now, 1, "1", "1", ""),
  createTransaction("Nutella", 9, "expense", now, 1, "1", "1", ""),
  createTransaction("Fralda RN 4kg", 29.99, "expense", now, 1, "1", "1", ""),
  createTransaction("Picole", 7.9, "expense", now, 1, "1", "1", ""),
  createTransaction("Pano de chao", 3.5, "expense", now, 1, "1", "1", ""),
  createTransaction("Vestido", 200, "expense", now, 1, "1", "1", ""),
  createTransaction("Combustivel", 199, "expense", now, 1, "1", "1", ""),
  createTransaction("Energia eletrica", 508, "expense", now, 1, "1", "1", ""),
  createTransaction("Condominio", 167, "expense", now, 1, "1", "1", ""),
  createTransaction("Internet", 104.99, "expense", now, 1, "1", "1", ""),
];
