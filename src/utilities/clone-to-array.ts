export function cloneToArray<T = unknown>(item: T, number: number): (T & { id: number })[] {
  return Array.from({ length: number }, (_, index) => {
    const obj = structuredClone(item) as any;
    obj.id = index + 1;
    return obj;
  });
}
