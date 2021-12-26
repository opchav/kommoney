import * as React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../styles/theme";
import createEmotionCache from "../utils/createEmotionCache";
import { MyAppProps } from "../types/page";
import { getMonth } from "../utils/helpers";
import { Transaction } from "../types/transaction";
import { TransactionContext } from "../context/TransactionContext";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

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

function MyApp(props: MyAppProps) {
  const [currentMonth, setCurrentMonth] = React.useState(getMonth());
  const [transactions, setTransactions] = React.useState<Transaction[]>(rows);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // https://dev.to/ofilipowicz/next-js-per-page-layouts-and-typescript-lh5
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>KomMoney</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TransactionContext.Provider value={{ transactions, setTransactions }}>
          {getLayout(
            <Component
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              {...pageProps}
            />
          )}
        </TransactionContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
