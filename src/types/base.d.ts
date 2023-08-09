type DateString = string;
type GetDiff<A, B> = Exclude<keyof A, keyof B>;
type Many<T> = T | ReadonlyArray<T>;
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);
