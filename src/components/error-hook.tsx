import React from "react";
import { Message, MultipleFieldErrors } from "react-hook-form";

type Props = {
  message: Message;
  messages?: MultipleFieldErrors;
};

const RenderError = (props: Props) => {
  return <p className="mt-1 text-red-500 text-xs">{props.message}</p>;
};
export const RenderErrorIcon = (props: Props) => {
  return <p className="text-red-500 flex items-center text-xs">{props.message}</p>;
};

export default RenderError;
