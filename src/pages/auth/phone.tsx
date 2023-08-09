import { Button } from "@/components/button";
import RenderError from "@/components/error-hook";
import { ErrorMessage } from "@hookform/error-message";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import { withServerSideSession } from "@/libs/auth";
import { joiResolver } from "@hookform/resolvers/joi";
import { useEffect, useState } from "react";

import { User } from "@/services/user";
import Joi from "joi";
import { phoneNumberRegex } from "@/utilities/validator";

interface IVerifyPhoneForm {
  phone: string;
  otp: string;
}

const schema = Joi.object({
  phone: Joi.string().pattern(phoneNumberRegex),
  otp: Joi.when(Joi.ref("$sent"), {
    is: Joi.equal(true),
    then: Joi.string().required().length(6),
    otherwise: Joi.string(),
  }),
});

const VerifyPhonePage: NextPage = ({ router }) => {
  const session = useSession({ required: true });
  const phoneNumber = session.data?.user.phone_number;
  const [isOtpSent, setOtpSent] = useState(Boolean(phoneNumber));
  const { register, formState, handleSubmit, setError, getValues } = useForm<IVerifyPhoneForm>({
    resolver: joiResolver(schema),
    defaultValues: {
      phone: phoneNumber,
    },
    context: { sent: isOtpSent },
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

  const onSubmit = handleSubmit(async function (values, e) {
    const isSubmit = (e as any).type === "submit";
    try {
      if ((!isOtpSent && isSubmit) || !isSubmit)
        await User.sendOtp(values.phone)
          .then((d) => setOtpSent(true))
          .catch((e: any) => {
            setOtpSent(true);
            throw new Error(e.response.data.message.join(", "));
          });
      if (isSubmit) {
        await User.verifyOtp(values)
          .then((d) => {
            setSuccessMessage(d.message.join(", "));
            return session.update();
          })
          .catch((e) => {
            throw new Error(e.response.data.message.join(", "));
          });
      }
    } catch (error: any) {
      setServerError(error.message);
    }
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src="/logo.png" alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Verify phone number
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
            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
              Phone number
            </label>
            <div className="mt-2">
              <input
                id="phone"
                type="text"
                autoComplete="phone"
                placeholder="phone"
                disabled={isOtpSent}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-30"
                {...register("phone")}
              />
            </div>
            <ErrorMessage name="phone" errors={formState.errors} render={RenderError} />
          </div>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
              OTP
            </label>
            <div className="mt-2">
              <input
                id="otp"
                type="text"
                autoComplete="otp"
                placeholder="otp"
                disabled={!isOtpSent}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-30"
                {...register("otp")}
              />
            </div>
            <ErrorMessage name="otp" errors={formState.errors} render={RenderError} />
          </div>
          <div className="flex flex-col lg:flex-row gap-2">
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              variant="indigo"
              className="rounded-md px-3 py-1.5 text-sm font-semibold"
            >
              Submit
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={formState.isSubmitting}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Send OTP
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyPhonePage;
export const getServerSideProps = withServerSideSession();
