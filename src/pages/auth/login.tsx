import { Button } from "@/components/button";
import RenderError from "@/components/error-hook";
import { ErrorMessage } from "@hookform/error-message";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { emailRegex } from "@/utilities/validator";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useEffect, useState } from "react";

interface ILoginForm {
  email: string;
  password: string;
}
const schema = Joi.object({
  email: Joi.string().pattern(emailRegex),
  password: Joi.string(),
});

const LoginPage: NextPage = ({ router }) => {
  const { register, formState, handleSubmit, setError } = useForm<ILoginForm>({
    resolver: joiResolver(schema),
  });
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

  const onSubmit = handleSubmit(async function (values) {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    }).then((response) => {
      if (response?.status === 200) {
        router.replace("/");
      } else setError("email", { message: response?.error || "Lỗi" });
    });
  });
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
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
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="text"
                // type="email"
                autoComplete="email"
                required
                placeholder="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("email")}
              />
            </div>
            <ErrorMessage name="email" errors={formState.errors} render={RenderError} />
          </div>
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
                placeholder="password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("password")}
              />
            </div>
            <ErrorMessage name="password" errors={formState.errors} render={RenderError} />
          </div>
          <div>
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
          <div>
            <p className="text-center text-sm text-gray-950">
              Don&apos;t have an account? <Link href="/auth/register">Sign up</Link>
            </p>
          </div>
        </form>

        <div>
          <div className="relative overflow-hidden text-center mt-10">
            <div className="divider-hr text-gray-200 text-sm">
              <span className="text-gray-900">Or continue with</span>
            </div>
          </div>
          <div className="grid mt-10 grid-cols-2 gap-4">
            <Button className="gap-3 rounded-md px-3 py-1.5 bg-[#1D9BF0] text-white">
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
              <span className="text-sm font-semibold">Twitter</span>
            </Button>
            <Button className="gap-3 rounded-md px-3 py-1.5 bg-[#24292F] text-white">
              <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="text-sm font-semibold">GitHub</span>
            </Button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link href="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Start a 14 day free trial
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
