// import { User } from "@/services/auth";
// import { login } from "@/services/auth/login";
import { User } from "@/services/user";
import axios from "axios";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
  Redirect,
} from "next";
import { NextAuthOptions, Session, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/email";
import CustomProvider from "./custom-provider";
import { ParsedUrlQuery } from "querystring";

export const authOptions: NextAuthOptions = {
  providers: [
    // CustomProvider({
    //   clientId: "12312",
    //   clientSecret: "your-256-bit-secret",
    // }),
    Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
        savePassword: { label: "Save password", type: "checkbox" },
      },
      async authorize(credentials, req) {
        const res = await User.login(credentials!).catch((e) => {
          if (!axios.isAxiosError(e)) throw e;
          throw new Error(e.response?.data.message[0]);
        });
        // If no error and we have user data, return it
        if (!res.error) {
          const access_token = res.data.access_token;
          const responseUser = await User.info(access_token);
          if (!responseUser.error) {
            return Object.assign(responseUser.data, { access_token });
          }
          return null;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, user, session, profile, trigger }) {
      const data = { ...token, ...user };
      // console.log({ token, user, account });
      return data;
    },
    async session({ session, user, token }) {
      const { access_token, ..._user } = token as any;
      if (access_token) {
        const responseUser = await User.info(access_token);
        if (!responseUser.error) {
          const user = responseUser.data;
          session.accessToken = access_token;
          session.user = user;
          return session;
        } else return null as any;
      }
      session.accessToken = token.access_token!;
      session.user = _user;
      return session;
    },
  },
  session: { maxAge: 8640000 },
};

export type CustomGetServerSideProps<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Params, Preview>,
  session: Session | null
) => Promise<GetServerSidePropsResult<Props>>;

function withServerSideSession<T extends {}>(
  cb?: CustomGetServerSideProps<T>,
  options?: { redirect?: Redirect }
): GetServerSideProps<T & { session: Session | null }> {
  return async function wrappedGetServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
      return {
        redirect: options?.redirect || {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    const isVerifyPage = String(context.req.url).includes("/auth/phone");
    // We are missing verify email
    if (!session.user.is_verified_phone) {
      if (isVerifyPage) return { props: { session } };
      return { redirect: { destination: "/auth/phone", permanent: false } };
    } else if (isVerifyPage) {
      return { redirect: { destination: "/", permanent: false } };
    }
    if (!cb) return { props: { session } as any };
    const response = await cb(context, session);
    if ("props" in response)
      return {
        props: {
          ...response.props,
          session,
        },
      };

    return response;
  };
}
export { withServerSideSession };
