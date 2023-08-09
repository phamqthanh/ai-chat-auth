export function convertToKeyValue<D extends { id: string | number }>(arr: D[]) {
  return arr.reduce((obj: Record<string | number, D>, v) => {
    obj[v.id] = v;
    return obj;
  }, {});
}
