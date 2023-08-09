export function pick<T extends object, P extends keyof T>(
  object: T,
  ...paths: Array<P>
): Pick<T, P> {
  return object == null
    ? ({} as any)
    : paths.reduce((obj: Pick<T, P>, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
          obj[key] = object[key];
        }
        return obj;
      }, {} as any);
}

export function omitValue<T extends object>(object: T, ...values: Array<any>) {
  if (object == null) return {} as T;
  const newObj: any = {};
  (Object.keys(object) as (keyof T)[]).forEach((key) => {
    const value = object[key];
    if (!values.includes(value)) newObj[key] = value;
  });
  return newObj as T;
}
