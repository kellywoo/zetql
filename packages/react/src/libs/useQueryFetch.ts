import { useEffect, useMemo } from 'react';
import { BoundQuery, shallowEqual } from './internalCore.ts';

type UseQueryFetchMeta<Deps> = Deps extends undefined | void
  ? {
      deps?: undefined;
      disabled?: boolean;
      isEqual?: (a: any, b: any) => boolean;
    }
  : {
      disabled?: boolean;
      isEqual?: (a: any, b: any) => boolean;
      deps: Deps;
    };
export function useQueryFetch<State, Deps>(
  querySubject: BoundQuery<State, Deps>
): void;

export function useQueryFetch<State, Deps>(
  querySubject: BoundQuery<State, Deps>,
  args: UseQueryFetchMeta<Deps>
): void;
export function useQueryFetch<State, Deps>(
  querySubject: BoundQuery<State, Deps>,
  args: UseQueryFetchMeta<Deps> = {} as any
) {
  const { deps, disabled, isEqual } = args || {};
  const { prevDeps } = querySubject((s) => ({
    prevDeps: s.lastDeps,
  }));
  const isSame = isEqual || shallowEqual;
  const memoizedDeps = useMemo(() => {
    return isSame(deps, prevDeps) ? prevDeps : deps;
  }, [isSame, deps, prevDeps]);
  useEffect(() => {
    if (!disabled) {
      querySubject.fetchQuery(
        memoizedDeps as Parameters<typeof querySubject.fetchQuery>[0]
      );
    }
  }, [disabled, memoizedDeps]);
}
