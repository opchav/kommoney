import { NextPage } from "next";
import { AppProps } from "next/app";
import { ComponentType, ReactElement, ReactNode } from "react";

export type Page<P = {}> = NextPage<P> & {
  // You can disable whichever you don't need
  getLayout?: (page: ReactElement) => ReactNode;
  // layout?: ComponentType;
};

export type MyAppProps<P = {}> = AppProps<P> & {
  Component: Page;
  emotionCache?: EmotionCache;
};
