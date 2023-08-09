import { UserTenantRole } from "@/services/auth/enum";
import type { NextComponentType, NextPage } from "next";
import { Router } from "next/router";
import { ReactElement, ReactNode } from "react";

declare module "next" {
  export type GetLayout<P = unknown> = (
    page: { children: ReactNode } & P
  ) => ReactElement<any, any> | null;
  export type NextPage<P = {}, IP = P> = NextComponentType<
    NextPageContext,
    IP,
    P & { router: Router; roles?: any[] }
  > & {
    getLayout?: GetLayout<P>;
    roles?: any[];
  };
}

declare module "next/app" {
  type AppProps<P = Record<string, unknown>> = {
    Component: NextPage;
    router: Router;
    __N_SSG?: boolean;
    __N_SSP?: boolean;
    pageProps: P & {
      /** Initial session passed in from `getServerSideProps` or `getInitialProps` */
      session?: Session;
    };
  };
}
