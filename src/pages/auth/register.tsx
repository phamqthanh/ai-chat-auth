import ExternalOAuth from "@/components/external-oauth";
import InputAuth from "@/components/input-auth";
import { RegisterParams, User } from "@/services/user";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NextSeo } from "next-seo";
import { Button } from "@/components/button";
import useBoolean from "@/hooks/useBoolean";

interface IRegisterForm extends RegisterParams {
  confirm_password: string;
}
const schema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .message("Email is not valid"),
  name: Joi.string().required(),
  // name: Joi.string().required().message("Name must not empty"),
  password: Joi.string().required(),
  confirm_password: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Password not match" }),
});
const RegisterPage: NextPage = () => {
  const { register, formState, handleSubmit, setError } = useForm<IRegisterForm>({
    resolver: joiResolver(schema),
  });
  const success = useBoolean();
  const [serverError, setServerError] = useState("");

  const onSubmit = handleSubmit(async function (values) {
    return User.register(values)
      .then(success.setTrue)
      .catch((e) => setServerError(e.response.data.message.join(", ")));
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <NextSeo title="Register" />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          src="/logo.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {success.value
            ? "Your account has just been created successfully"
            : "Create your account"}
        </h2>
      </div>

      {success.value ? (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="text-center">
            An email has also been sent to the email address you just signed up for. Please check to
            activate your account
          </p>
          <div className="mt-6">
            <Button className="py-1.5 px-3 rounded-md bg-indigo-600 hover:bg-indigo-500">
              Go to login
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" autoComplete="off" autoCorrect="off" onSubmit={onSubmit}>
            {serverError && (
              <div className="bg-red-100 text-red-500 px-2 py-1.5 rounded text-sm">
                Error: {serverError}
              </div>
            )}
            <InputAuth
              label="Email address"
              placeholder="Email address"
              type="text"
              {...register("email")}
              errors={formState.errors}
            />
            <InputAuth
              label="Name"
              placeholder="name"
              type="text"
              {...register("name")}
              errors={formState.errors}
            />
            <InputAuth
              label="Password"
              placeholder="Password"
              type="password"
              {...register("password")}
              errors={formState.errors}
            />
            <InputAuth
              label="Confirm password"
              placeholder="Confirm password"
              type="password"
              {...register("confirm_password")}
              errors={formState.errors}
            />
            <div>
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-30"
                loading={formState.isSubmitting}
              >
                Sign up
              </Button>
            </div>
            <div>
              <p className="text-center text-sm text-gray-950">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600">
                  Log in
                </Link>
              </p>
            </div>
          </form>

          <ExternalOAuth />
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
