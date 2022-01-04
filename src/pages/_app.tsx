import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import { SessionProvider } from 'next-auth/react';
import theme from '../styles/theme';
import createEmotionCache from '../utils/createEmotionCache';
import { MyAppProps } from '../types/page';
import { getPeriod, Period } from '../utils/helpers';
import { TransactionsProvider } from '../context/TransactionContext';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props: MyAppProps) {
  const [currentPeriod, setCurrentPeriod] = React.useState<Period>(getPeriod);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // https://dev.to/ofilipowicz/next-js-per-page-layouts-and-typescript-lh5
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);
  console.log('>>', props.session);

  return (
    <SessionProvider session={props.session}>
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
                currentPeriod={currentPeriod}
                setCurrentPeriod={setCurrentPeriod}
                {...pageProps}
              />,
            )}
          </TransactionsProvider>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}

export default MyApp;
