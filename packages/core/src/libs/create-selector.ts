import { BoundSubject } from './types.ts';
import { Notifier, NotifierSubscription } from './utils/notifier.ts';
import { shallowEqual } from 'fast-equals';

type PickState<T extends BoundSubject<any>> = T extends BoundSubject<infer S> ? S : never;
type PickStateArray<T extends Array<BoundSubject<any>>> = T extends [infer M1 extends BoundSubject<any>]
	? [PickState<M1>]
	: T extends [infer M1 extends BoundSubject<any>, ...infer Mr extends Array<BoundSubject<any>>]
	? [PickState<M1>, ...PickStateArray<Mr>]
	: T extends []
	? []
	: never;

type Selector<S> = {
	getValue: () => S;
	subscribe: (fn: NotifierSubscription<S>) => () => void;
};

// ......better way??
export function createSelector<A, S>(
	states: [BoundSubject<A>],
	projector: (a: A) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;
export function createSelector<A, B, S>(
	states: [BoundSubject<A>, BoundSubject<B>],
	projector: (a: A, b: B) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;
export function createSelector<A, B, C, S>(
	states: [BoundSubject<A>, BoundSubject<B>, BoundSubject<C>],
	projector: (a: A, b: B, c: C) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;
export function createSelector<A, B, C, D, S>(
	states: [BoundSubject<A>, BoundSubject<B>, BoundSubject<C>, BoundSubject<D>],
	projector: (a: A, b: B, c: C, d: D) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;
export function createSelector<A, B, C, D, E, S>(
	states: [BoundSubject<A>, BoundSubject<B>, BoundSubject<C>, BoundSubject<D>, BoundSubject<E>],
	projector: (a: A, b: B, c: C, d: D, e: E) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;
export function createSelector<A, B, C, D, E, F, S>(
	states: [BoundSubject<A>, BoundSubject<B>, BoundSubject<C>, BoundSubject<D>, BoundSubject<E>, BoundSubject<F>],
	projector: (a: A, b: B, c: C, d: D, e: E, f: F) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;
export function createSelector<A, B, C, D, E, F, G, S>(
	states: [
		BoundSubject<A>,
		BoundSubject<B>,
		BoundSubject<C>,
		BoundSubject<D>,
		BoundSubject<E>,
		BoundSubject<F>,
		BoundSubject<G>
	],
	projector: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;
export function createSelector<A, B, C, D, E, F, G, H, S>(
	states: [
		BoundSubject<A>,
		BoundSubject<B>,
		BoundSubject<C>,
		BoundSubject<D>,
		BoundSubject<E>,
		BoundSubject<F>,
		BoundSubject<G>,
		BoundSubject<H>
	],
	projector: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;
export function createSelector<A, B, C, D, E, F, G, H, I, S>(
	states: [
		BoundSubject<A>,
		BoundSubject<B>,
		BoundSubject<C>,
		BoundSubject<D>,
		BoundSubject<E>,
		BoundSubject<F>,
		BoundSubject<G>,
		BoundSubject<H>,
		BoundSubject<I>
	],
	projector: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;
export function createSelector<A, B, C, D, E, F, G, H, I, J, S>(
	states: [
		BoundSubject<A>,
		BoundSubject<B>,
		BoundSubject<C>,
		BoundSubject<D>,
		BoundSubject<E>,
		BoundSubject<F>,
		BoundSubject<G>,
		BoundSubject<H>,
		BoundSubject<I>,
		BoundSubject<J>
	],
	projector: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;
export function createSelector<A, B, C, D, E, F, G, H, I, J, K, S>(
	states: [
		BoundSubject<A>,
		BoundSubject<B>,
		BoundSubject<C>,
		BoundSubject<D>,
		BoundSubject<E>,
		BoundSubject<F>,
		BoundSubject<G>,
		BoundSubject<H>,
		BoundSubject<I>,
		BoundSubject<J>,
		BoundSubject<K>
	],
	projector: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, k: K) => S,
	isEqual?: (a: S, b: S) => boolean
): Selector<S>;

export function createSelector<T extends Array<BoundSubject<any>>, S>(
	subjects: T,
	projector: (...args: any[]) => S,
	isEqual?: (a: S, b: S) => boolean
) {
	const values = [] as unknown as PickStateArray<T>;
	const unsubscribes: Array<() => void> = [];
	const notifier = new Notifier<S>();
	let state!: S;
	const isSame = isEqual || shallowEqual;
	const selectorSafe = (...s: PickStateArray<T>) => {
		try {
			return projector(...s);
		} catch (e) {
			return state;
		}
	};

	subjects.forEach((subject, i) => {
		values[i] = subject();
		unsubscribes[i] = subject.subscribe((st: any) => {
			values[i] = st;
			const nextState = selectorSafe(...values);
			if (!isSame(state, nextState)) {
				state = nextState;
				notifier.next(state);
			}
		});
	});
	state = selectorSafe(...values);

	return {
		getValue: () => state,
		subscribe(fn: NotifierSubscription<S>) {
			const unsub = notifier.subscribe(fn);
			return () => {
				unsubscribes.forEach((un) => {
					un();
				});
				unsub();
			};
		},
	};
}
