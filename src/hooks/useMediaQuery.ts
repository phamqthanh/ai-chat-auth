import { useCallback, useEffect, useState } from "react";

export enum MediaScreen {
  Mobile,
  Tablet,
  Laptop,
  Desktop,
}

const screenSize = {
  tablet: "(min-width: 768px) and (min-height: calc(480px + 1px))",
  laptop: "(min-width: 1024px) and (min-height: calc(480px + 1px))",
  desktop: "(min-width: 1200px) and (min-height: calc(480px + 1px))",
};
const matchesScreen = () =>
  "undefined" === typeof window || "undefined" === typeof window.matchMedia
    ? MediaScreen.Desktop
    : window.matchMedia(screenSize.desktop).matches
    ? MediaScreen.Desktop
    : window.matchMedia(screenSize.laptop).matches
    ? MediaScreen.Laptop
    : window.matchMedia(screenSize.tablet).matches
    ? MediaScreen.Tablet
    : MediaScreen.Mobile;
const useMediaQuery = (initial?: MediaScreen) => {
  const [state, setState] = useState(typeof initial === "number" ? initial : matchesScreen);
  const update = useCallback(() => {
    const matchedScreen = matchesScreen();
    setState(matchedScreen);
  }, []);
  useEffect(() => update(), [update]);

  useMediaListener(screenSize.desktop, update);
  useMediaListener(screenSize.laptop, update);
  useMediaListener(screenSize.tablet, update);

  return state;
};

const useMediaListener = (media: string, cb: () => void) => {
  useEffect(() => {
    const mediaQuery = window.matchMedia(media);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", cb);
      return () => mediaQuery.removeEventListener("change", cb);
    }
  }, [media, cb]);
};

export default useMediaQuery;
