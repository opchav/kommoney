import * as React from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../styles/theme";
import createEmotionCache from "../utils/createEmotionCache";
import { MyAppProps } from "../types/page";
import { getMonth } from "../utils/helpers";
import { TransactionsProvider } from "../context/TransactionContext";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props: MyAppProps) {
  const [currentMonth, setCurrentMonth] = React.useState(getMonth());

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
        <TransactionsProvider>
          {getLayout(
            <Component
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              {...pageProps}
            />
          )}
        </TransactionsProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
