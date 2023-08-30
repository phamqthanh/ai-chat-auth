import Link from "next/link";
import clsx from "clsx";
import { FaCircleNotch } from "react-icons/fa";

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
      />
    </svg>
  );
}

const variantStyles = {
  // primary:
  //   "rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 dark:hover:ring-emerald-300",
  // secondary:
  //   "rounded-full bg-zinc-100 py-1 px-3 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:ring-1 dark:ring-inset dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
  // filled:
  //   "rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400",
  // outline:
  //   "rounded-full py-1 px-3 text-zinc-700 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white",
  // text: "text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-500",
  primary: "gap-3 bg-[#1D9BF0] text-white",
  indigo:
    "bg-indigo-600 leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
  // primary:
  //   "bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 dark:hover:ring-emerald-300",
  // secondary:
  //   "bg-zinc-100 py-1 px-3 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:ring-1 dark:ring-inset dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
  // filled:
  //   "bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400",
  // outline:
  //   "py-1 px-3 text-zinc-700 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white",
  // text: "text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-500",
};

type ButtonProps = {
  variant?: keyof typeof variantStyles;
  arrow?: "left" | "right";
  outline?: boolean;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  className,
  children,
  arrow,
  outline,
  loading,

  ...props
}: (JSX.IntrinsicElements["button"] | JSX.IntrinsicElements["a"]) & ButtonProps) {
  let Component: any = "href" in props && props.href ? Link : ((props.type ||= "button"), "button");

  className = clsx(
    "flex w-full items-center justify-center transition",
    outline ? "btn-outline" : undefined,
    variantStyles[variant],
    className
  );

  let arrowIcon = (
    <ArrowIcon
      className={clsx(
        "mt-0.5 h-5 w-5"
        // variant === "text" && "relative top-px",
        // arrow === "left" && "-ml-1 rotate-180",
        // arrow === "right" && "-mr-1"
      )}
    />
  );

  return (
    <Component className={className} {...props}>
      {loading && <FaCircleNotch className="mt-0.5 h-5 w-5 animate-spin" />}
      {arrow === "left" && arrowIcon}
      {children}
      {arrow === "right" && arrowIcon}
    </Component>
  );
}
