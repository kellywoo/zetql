export const classnames = (...args: Array<string | null | undefined | boolean>) => {
  return args.filter(Boolean).join(' ')
};
