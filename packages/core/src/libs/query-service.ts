import { QueryAction } from './types.ts';
import { Notifier } from './utils/notifier.ts';

export class QueryService {
	private static singleton: QueryService;
	readonly queryErrorNotifier = new Notifier<Error>();
	static create() {
		return this.singleton || new QueryService();
	}
	private constructor() {
		QueryService.singleton = this;
	}
	reducerMap: Record<string, any> = {};
	registerReducer(storeName: string, reducer: any) {
		this.reducerMap[storeName] = reducer;
	}
	dispatch(action: QueryAction) {
		Object.values(this.reducerMap).forEach((reducer) => {
			reducer(action);
		});
	}
	unregister(key: string) {
		if (!this.reducerMap[key]) {
			return;
		}
		delete this.reducerMap[key];
	}
}
