import { BoundSubject, GetStatePayload, GetStateWithSelector, SubjectInitCreator, SetStatePayload } from './types.ts';
import { shallowEqual } from 'fast-equals';

export function createSubject<S extends object>(initState: SubjectInitCreator<S> | S): BoundSubject<S> {
	let state = {} as S;
	const listeners = new Set<(s: S) => void>();
	const getState: GetStateWithSelector<S> = (fn = ((a: S) => a) as any) => {
		if (typeof fn === 'function') {
			return fn(state);
		}
		return state;
	};
	const setState = (s: SetStatePayload<S>) => {
		// if newState has the same reference, do not trigger listeners.
		if (s === state) {
			return;
		}
		const newState = typeof s === 'function' ? s(state): { ...state, ...s }
		if (newState === state) {
			return;
		}
		if (!shallowEqual(newState, state)) {
			state = newState;
		}
		listeners.forEach((fn) => {
			fn(state);
		});
	};
	const subscribe = (fn: (s: S) => void) => {
		listeners.add(fn);
		return () => {
			listeners.delete(fn);
		};
	};
	if (typeof initState === 'function') {
		state = initState(setState, getState, subscribe);
	} else {
		state = initState;
	}
	function stateManager(fn: GetStatePayload<S> = ((a: S) => a) as any) {
		return getState(fn);
	}
	stateManager.subscribe = subscribe;
	stateManager.setState = setState;
	stateManager.destroy = () => {
		listeners.clear();
	};
	return stateManager;
}
// const m = createSubject({a: 1, b:2})
// const t = m(s =>{
// 	return s.a + s.b
// })
// t.toString()
