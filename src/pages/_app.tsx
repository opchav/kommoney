import * as React from "react";
import { NextPage } from "next";
import type { NextComponentType } from "next";
import type { ReactNode } from "react";
import Head from "next/head";
import { AppContext, AppInitialProps, AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../styles/theme";
import createEmotionCache from "../utils/createEmotionCache";
import { MyAppProps } from "../types/page";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // https://dev.to/ofilipowicz/next-js-per-page-layouts-and-typescript-lh5
  const getLayout = Component.getLayout || ((page: React.ReactNode) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Change title in _app.tsx</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
