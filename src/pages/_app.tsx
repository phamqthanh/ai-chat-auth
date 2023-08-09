import { axiosInstance } from "@/services";
import "@/styles/globals.scss";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

function DefaultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
export default function App({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
  const Layout = Component.getLayout ?? DefaultLayout;
  if (session?.accessToken) {
    axiosInstance.defaults.headers.common.Authorization = "Bearer " + session.accessToken;
  }
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false} refetchWhenOffline={false}>
      <Layout>
        <Component {...pageProps} router={router} />
      </Layout>
    </SessionProvider>
  );
}
