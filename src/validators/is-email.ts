// Email address matcher.
var matcher =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Loosely validate an email address.
 */
export default function isEmail(string: unknown | string) {
  if (typeof string !== "string") return false;
  if (string.length > 320) return false;
  return matcher.test(string);
}
