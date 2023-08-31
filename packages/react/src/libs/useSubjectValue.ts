import { useRef, useSyncExternalStore } from 'react';
import { BoundSubject } from './internalCore.ts';
import { shallowEqual } from 'fast-equals';

export function useSubjectValue<S>(query: BoundSubject<S>): S;
export function useSubjectValue<S, R>(
	query: BoundSubject<S>,
	selector: (s: S) => R
): R;
export function useSubjectValue<S, R>(
	query: BoundSubject<S>,
	selector: (s: S) => R,
	isEqual?: (a: R, b: R) => boolean
): R;

export function useSubjectValue<S, R>(
	query: BoundSubject<S>,
	projector: (s: S) => R = ((a: S) => a) as any,
	isEqual?: (a: any, b: any) => boolean
): R {
	const isEqualFn = isEqual || shallowEqual;
	const ref = useRef<{
		value: R | undefined;
		projector: (s: S) => R;
		isEqualFn: (a: any, b: any) => boolean;
	}>({ value: undefined, projector, isEqualFn });
	ref.current.projector = projector;
	ref.current.isEqualFn = isEqualFn;
	const getSnapshot = () => {
		const state = query(projector);
		const prev = ref.current.value;
		if (ref.current.isEqualFn(state, prev)) {
			return prev as R;
		}
		ref.current.value = state;
		return state as R;
	};
	return useSyncExternalStore(query.subscribe, getSnapshot, getSnapshot);
}

//useSyncExternalStore

// const q = createSubject({ hello: 1 });
// // eslint-disable-next-line react-hooks/rules-of-hooks
// const b = useSubjectValue(q);
// // eslint-disable-next-line react-hooks/rules-of-hooks
// const c = useSubjectValue(q, (a) => a.hello);
