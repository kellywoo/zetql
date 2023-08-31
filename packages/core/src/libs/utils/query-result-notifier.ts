import { QueryDataListener, QueryErrorListener } from '../types.ts';

export class QueryResultNotifier<State, Deps> {
	private successSet = new Set<QueryDataListener<State, Deps>>();
	private errorSet = new Set<QueryErrorListener<Deps>>();
	notifySuccess(data: { data: State; deps: Deps; queryId: string; fromCache: boolean }) {
		this.successSet.forEach((fn) => {
			fn(data);
		});
	}
	notifyError(data: { error: Error; deps: Deps; queryId: string }) {
		this.errorSet.forEach((fn) => {
			fn(data);
		});
	}
	subscribeData(fn: QueryDataListener<State, Deps>) {
		this.successSet.add(fn);
		return () => {
			return this.successSet.delete(fn);
		};
	}
	subscribeError(fn: QueryErrorListener<Deps>) {
		this.errorSet.add(fn);
		return () => {
			return this.errorSet.delete(fn);
		};
	}
}
