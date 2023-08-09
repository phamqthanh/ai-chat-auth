export const configs = Object.freeze({
  API_DOMAIN: process.env.NEXT_PUBLIC_API_DOMAIN,
  IS_DEVELOPEMNT: process.env.NODE_ENV === "development",
});
