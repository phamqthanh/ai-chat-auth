import { Button } from "@/components/button";
import RenderError from "@/components/error-hook";
import { ErrorMessage } from "@hookform/error-message";
import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { emailRegex, isString } from "@/utilities/validator";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useEffect, useState } from "react";

import ExternalOAuth from "@/components/external-oauth";
import InputAuth from "@/components/input-auth";
import { configs } from "@/configs";
import { NextSeo } from "next-seo";

// https://auth0.openai.com/authorize?client_id=TdJIcbe16WoTHtN95nyywh5E4yOo6ItG&scope=openid%20email%20profile%20offline_access%20model.request%20model.read%20organization.read%20organization.write&response_type=code&redirect_uri=https%3A%2F%2Fchat.openai.com%2Fapi%2Fauth%2Fcallback%2Fauth0&audience=https%3A%2F%2Fapi.openai.com%2Fv1&prompt=login&state=ZWUOlWSFOJDaGXSrHOGENFEVMSHCtb_sDUMsT6c6Vus&code_challenge=K36ql4N0OLB-ozh_mUvFIIqrwzvmDF2Ab_98C3Yw7Xw&code_challenge_method=S256
interface ILoginForm {
  email: string;
  password: string;
}
const schema = Joi.object({
  email: Joi.string().pattern(emailRegex),
  password: Joi.string(),
});

const LoginPage: NextPage = ({ router }) => {
  const session = useSession({ required: false });
  const { register, formState, handleSubmit, setError } = useForm<ILoginForm>({
    resolver: joiResolver(schema),
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    const error = router.query.error ? String(router.query.error) : undefined;
    const message = router.query.message ? String(router.query.message) : undefined;
    if (error) {
      router.replace(router.asPath.split("?")[0], undefined, { shallow: true });
      setServerError(error);
    } else if (message) {
      router.replace(router.asPath.split("?")[0], undefined, { shallow: true });
      setSuccessMessage(message);
    }
  }, [router, router.query]);

  useEffect(() => {
    if (isSubmitted && session.data) {
      const cookie = Object.entries({
        "chat.access_token": session.data.accessToken,
        expires: new Date(session.data.expires).toUTCString(),
        domain: configs.IS_DEVELOPEMNT ? "localhost" : ".openai.com",
        path: "/",
      })
        .map((v) => v[0] + "=" + v[1])
        .join("; ");

      document.cookie = cookie;
      if (isString(router.query.redirect_uri)) {
        window.location.href = router.query.redirect_uri;
      } else if (configs.IS_DEVELOPEMNT) {
        window.location.href = "http://localhost:3001";
      } else {
        router.replace("/");
      }
    }
  }, [router, router.query.redirect_uri, session.data, isSubmitted]);

  const onSubmit = handleSubmit(async function (values) {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    }).then((response) => {
      if (response?.status === 200) {
        setIsSubmitted(true);
        if (isString(router.query.redirect_uri)) {
          window.location.href = router.query.redirect_uri;
        } else if (configs.IS_DEVELOPEMNT) {
          // window.location.href = "http://localhost:3001";
        } else {
          // router.replace("/");
        }
      } else setError("email", { message: response?.error || "Lỗi" });
    });
  });
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <NextSeo title="Login" />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          src="/logo.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={onSubmit}>
          {serverError && (
            <div className="bg-red-100 text-red-500 px-2 py-1.5 rounded text-sm">
              Error: {serverError}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 text-green-500 px-2 py-1.5 rounded text-sm">
              {successMessage}
            </div>
          )}
          <InputAuth label="Email address" type="text" placeholder="Email" {...register("email")} />
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("password")}
              />
            </div>
            <ErrorMessage name="password" errors={formState.errors} render={RenderError} />
          </div>
          <div>
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              loading={formState.isSubmitting}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-30"
            >
              Sign in
            </Button>
          </div>
          <div>
            <p className="text-center text-sm text-gray-950">
              Don&apos;t have an account? <Link href="/auth/register">Sign up</Link>
            </p>
          </div>
        </form>

        <ExternalOAuth />
      </div>
    </div>
  );
};

export default LoginPage;
// export const getServerSideProps: GetServerSideProps = withServerSideSession();
