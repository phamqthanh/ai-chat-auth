import useMediaQuery, { MediaScreen } from "@/hooks/useMediaQuery";
import { useResize } from "@/hooks/useResize";
import clsx from "clsx";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Button } from "../button";
import { signOut } from "next-auth/react";

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
          <div className="h-full flex flex-col">
            <div>toasdasdp</div>
            <div className="flex-1 overflow-auto">content</div>
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
  );
};

export default Layout;
