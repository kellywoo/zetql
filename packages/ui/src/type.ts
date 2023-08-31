export type TypeOfValue<T> = T[keyof T];
export type SetStatePayload<T> = T | Partial<T> | ((s: T) => T);
