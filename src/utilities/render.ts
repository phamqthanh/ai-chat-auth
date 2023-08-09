import { CustomElementProps, PropsOf } from "@/types/element";
import { ReactTag } from "@/types/element";
import React, { createElement, forwardRef } from "react";

/**
 * This is a hack, but basically we want to keep the full 'API' of the component, but we do want to
 * wrap it in a forwardRef so that we _can_ passthrough the ref
 */
export function forwardRefWithAs<T extends { name: string; displayName?: string }>(
  component: T
): T & { displayName: string } {
  return Object.assign(forwardRef(component as unknown as any) as any, {
    displayName: component.displayName ?? component.name,
  });
}

type Props<T extends ReactTag = "div"> = {
  as?: T;
  children?: React.ReactNode;
} & PropsOf<T>;

const Element = forwardRefWithAs(function <TTag extends ReactTag = "div">(
  { as, children, ...rest }: Props<TTag>,
  ref: any
) {
  return createElement(as || "div", Object.assign({}, rest, { ref }), children);
});

export default Element;
