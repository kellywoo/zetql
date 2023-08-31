import { useEffect, useMemo } from 'react';
import { BoundQuery } from './internalCore.ts';
import { shallowEqual } from 'fast-equals';

export function useQueryFetch<State, Deps>(
	querySubject: BoundQuery<State, Deps>
): void;

export function useQueryFetch<State, Deps>(
	querySubject: BoundQuery<State, Deps>,
	args: Deps extends undefined
		? {
				deps?: undefined;
				disabled?: boolean;
				isEqual?: (a: any, b: any) => boolean;
		  }
		: {
				disabled?: boolean;
				isEqual?: (a: any, b: any) => boolean;
				deps: Deps;
		  }
): void;
export function useQueryFetch<State, Deps>(
	querySubject: BoundQuery<State, Deps>,
	args: Deps extends undefined
		? {
				deps?: undefined;
				disabled?: boolean;
				isEqual?: (a: any, b: any) => boolean;
		  }
		: {
				deps: Deps;
				disabled?: boolean;
				isEqual?: (a: any, b: any) => boolean;
		  } = {} as any
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
			querySubject.fetchQuery(memoizedDeps!);
		}
	}, [disabled, memoizedDeps]);
}
