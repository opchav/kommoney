import React from "react";
import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box'

import { getLayout } from "../components/layouts/dashboard/Dashboard";

import TransactionsTable from "../components/transactions/TransactionsTable";
import { Transaction } from "../types/transaction";
import { MyAppState } from "../types/my-app";
import MonthSelector from "../components/MonthSelector";
import TransactionForm from "../components/TransactionForm";

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
const rows = [
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

export default function TransactionsPage({
  currentMonth,
  setCurrentMonth,
}: MyAppState) {
  const [transactions, setTransactions] = React.useState<Transaction[]>(rows);

  const saveTransaction = (transaction: Transaction) => {
    setTransactions((previous) => [...previous, transaction]);
  };

  return (
    <>
      <Grid container spacing={3} sx={{ pb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", ml: -2 }}>
            <MonthSelector
              setCurrentMonth={setCurrentMonth}
              currentMonth={currentMonth}
            />
            <Box sx={{ flexGrow: 1 }}></Box>
            <TransactionForm saveTransaction={saveTransaction} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TransactionsTable transactions={transactions} />
        </Grid>
      </Grid>
    </>
  );
}

TransactionsPage.getLayout = getLayout;
