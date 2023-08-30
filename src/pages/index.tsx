import Layout from "@/components/layout/default";
import { withServerSideSession } from "@/libs/auth";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      const element = textareaRef.current;
      element.style.overflow = element.scrollHeight <= 200 ? "hidden" : "";
      element.style.height = "inherit";
      element.style.height = `${element.scrollHeight}px`;
    }
  }, [value]);

  return (
    <>
      <NextSeo title="Home" />
      <main className="relative h-screen w-full transition-width items-stretch flex-1">
        {/* <div className="flex flex-col overflow-auto h-full">
          <div className="flex-1">
            {Array(100)
              .fill(1)
              .map((_, id) => (
                <div key={id} className="py-2 my-2 bg-gray-200 px-2">
                  this is long height
                </div>
              ))}
          </div>

          <div className="sticky bottom-0 bg-gradient-to-b from-transparent to-white">
            <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
              <div
                className="relative flex h-full flex-1 items-stretch md:flex-col"
                role="presentation"
              >
                <div className="flex flex-col w-full py-[10px] flex-grow md:py-4 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-xl shadow-xs dark:shadow-xs">
                  <textarea
                    id="prompt-textarea"
                    ref={textareaRef}
                    tabIndex={0}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={{ maxHeight: 200 }}
                    placeholder="Send a message"
                    className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pr-12 pl-3 md:pl-0"
                    rows={1}
                  />
                  <button className="absolute p-1 rounded-md md:bottom-3 md:p-2 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 disabled:text-gray-400 enabled:bg-brand-purple text-white bottom-1.5 transition-colors disabled:opacity-40">
                    <span className="" data-state="closed">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-4 w-4 m-1 md:m-0"
                        stroke-width="2"
                      >
                        <path
                          d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div> */}
      </main>
    </>
  );
}

// Home.getLayout = Layout;
export const getServerSideProps: GetServerSideProps = withServerSideSession();
