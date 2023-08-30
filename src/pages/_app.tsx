import { axiosInstance } from "@/services";
import { store } from "@/store/store";
import "@/styles/globals.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect, useMemo } from "react";
import { Provider } from "react-redux";

function DefaultLayout({ children }: { children: React.ReactNode }) {
  return children;
}

export default function App({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
  const Layout = Component.getLayout ?? DefaultLayout;
  if (session?.accessToken) {
    axiosInstance.defaults.headers.common.Authorization = "Bearer " + session.accessToken;
  }
  useEffect(() => {
    Router.events.on("routeChangeStart", NProgress.start);
    Router.events.on("routeChangeComplete", NProgress.done);
    return () => {
      Router.events.off("routeChangeStart", NProgress.start);
      Router.events.off("routeChangeComplete", NProgress.done);
    };
  }, []);
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false, refetchInterval: false } },
      }),
    []
  );
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <QueryClientProvider client={queryClient}>
        {/* <Provider store={store}> */}
        <Layout>
          <Component {...pageProps} router={router} />
        </Layout>
        {/* </Provider> */}
      </QueryClientProvider>
    </SessionProvider>
  );
}
