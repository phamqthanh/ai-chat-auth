type UnknownArrayOrObject = unknown[] | Record<string, unknown>;
// https://github.com/react-hook-form/react-hook-form/discussions/1991#discussioncomment-351784
export const dirtyValues = (
  dirtyFields: UnknownArrayOrObject | boolean,
  allValues: UnknownArrayOrObject
): UnknownArrayOrObject => {
  // NOTE: Recursive function.

  // If *any* item in an array was modified, the entire array must be submitted, because there's no
  // way to indicate "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues;
  }
  // Here, we have an object.
  return Object.fromEntries(
    Object.keys(dirtyFields)
      .filter((key) => (dirtyFields as any)[key])
      .map((key) => [key, dirtyValues((dirtyFields as any)[key], (allValues as any)[key])])
  );
};
