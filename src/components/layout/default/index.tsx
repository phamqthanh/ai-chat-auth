import useMediaQuery, { MediaScreen } from "@/hooks/useMediaQuery";
import { useResize } from "@/hooks/useResize";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Button } from "../../button";
import ConverstationProvider, { useConversation } from "./converstation-provider";

const Layout = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>(null);
  const mediaQuery = useMediaQuery(MediaScreen.Mobile);
  const resize = useResize(ref, { default: 300, min: 200, max: 500 });
  const isLaptop = mediaQuery > MediaScreen.Tablet;
  useEffect(() => {
    if (resize.isResize) document.body.classList.add("cursor-ew-resize");
    else document.body.classList.remove("cursor-ew-resize");
  }, [resize.isResize]);

  return (
    <ConverstationProvider>
      <div className="overflow-hidden w-full h-full relative flex z-0">
        <div className="relative flex h-full max-w-full flex-1 overflow-hidden">
          <div
            ref={ref}
            className="hidden lg:block h-screen border-r border-gray-800 relative z-50 flex-shrink-0"
            style={{ width: !isLaptop ? undefined : 300 }}
          >
            {isLaptop && (
              <div className="absolute inset-y-0 right-0" onMouseDown={resize.onMouseDown}>
                <div
                  className={clsx(
                    "w-1 h-full hover:bg-gray-800 cursor-ew-resize",
                    resize.isResize && "bg-gray-800"
                  )}
                />
              </div>
            )}
            <div className="h-full flex flex-col py-2">
              <div className="px-2">
                <Link
                  href="/"
                  className="flex py-3 px-3 items-center gap-3 relative rounded-md group border border-gray-300"
                >
                  New chat
                </Link>
                toasdasdp
              </div>
              <div className="flex-1 overflow-auto pl-2">
                <Navigation />
              </div>
              {/* <div className="flex-1 overflow-auto">content</div> */}
              <div className="p-2">
                <Button className="rounded py-2" onClick={() => signOut()}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </ConverstationProvider>
  );
};

const Navigation = () => {
  const { conversations, sortedConversations } = useConversation();
  const router = useRouter();
  router.query.id;
  const activeId = "12";

  return (
    <div>
      {[
        sortedConversations.recent,
        sortedConversations.dynamicMonths,
        sortedConversations.dynamicYears,
      ].flatMap((e, t) =>
        Object.entries(e).map(([key, conversation]) => {
          if ("today" !== key && !conversation.items.length) return null;

          return (
            <div key={key} className="relative">
              <div className="sticky top-0 z-[14]" data-projection-id="7">
                <h3 className="h-9 pb-2 pt-3 px-3 text-xs text-gray-400 font-medium text-ellipsis overflow-hidden break-all bg-white">
                  {conversation.label}
                </h3>
              </div>
              <ol>
                {conversation.items.map(({ id, content, title }) => {
                  return (
                    <li key={id}>
                      <Link
                        href={{ pathname: "/c/[id]", query: { id } }}
                        shallow
                        className={clsx(
                          "flex py-3 px-3 items-center gap-3 relative rounded-md group",
                          "cursor-pointer break-all",
                          id === activeId
                            ? "bg-gray-800 pr-14 hover:bg-gray-100"
                            : "hover:bg-gray-200 hover:pr-4 "
                        )}
                      >
                        <div className="truncate">{title}</div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Layout;
