export type TypeOfValue<T> = T[keyof T];
export type SetStatePayload<T> = T | Partial<T> | ((s: T) => T);
export interface SelectOption<T = 'string', S = any> {
  value: T;
  name: string;
  info?: S;
}
