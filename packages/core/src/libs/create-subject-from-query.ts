import { BoundQuery, BoundSubjectFromQuery, QueryState } from './types.ts';
import { createSubject } from './create-subject.ts';
import { shallowEqual } from 'fast-equals';

export function createSubjectFromQuery<S extends object, P = any>(
	querySubject: BoundQuery<S, P>
): BoundSubjectFromQuery<S, P> {
	const { subscribeData } = querySubject;
	const subject = createSubject<S>(
		querySubject((s: QueryState<S, P>) => {
			return s.data;
		})
	);
	let activateSubscriptionUnsub: (() => void) | null = null;
	const originDestroy = subject.destroy;

	const dataSubject = subject as BoundSubjectFromQuery<S, P>;
	dataSubject.sync = () => {
		subject.setState(querySubject((s) => s.data));
	};
	dataSubject.init = (fn: (current: S, next: S, error: Error | null) => S) => {
		if (activateSubscriptionUnsub) {
			activateSubscriptionUnsub();
		}
		subject.setState(querySubject((s) => s.data));
		return (activateSubscriptionUnsub = subscribeData(({ data }) => {
			const newData = fn(dataSubject(), data, null);
			subject.setState(newData);
		}));
	};
	dataSubject.isSynced = (isEqual = shallowEqual) => {
		return isEqual(
			subject(),
			querySubject((s) => s.data)
		);
	};
	dataSubject.destroy = () => {
		if (activateSubscriptionUnsub) {
			activateSubscriptionUnsub();
			activateSubscriptionUnsub = null;
		}
		originDestroy();
	};

	return dataSubject;
}
