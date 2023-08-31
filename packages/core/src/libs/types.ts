export interface GetStateWithSelector<State> {
	(): State;
	<Fn extends (s: State) => any>(fn: Fn): Fn extends (s: State) => infer R ? R : State;
}
export type TypeOfValue<T> = T[keyof T];
export type SetStatePayload<T> = T | Partial<T> | ((s: T) => T);

/**
 * @types: cache
 */
export type GetStatePayload<State> = ((s: State) => any) | undefined;

export type CacheItemKeyBy = (p: any) => string;
export type CacheGroupKeyBy = (p: any) => any;

export interface CacheGroupOption {
	staleTime: number; // s
	extraCacheTime: number;
	// cacheKeyBy: CacheItemKeyBy;
}

export type CacheDBOptions = {
	/**
	 * time to use existing cache instead of query new one
	 * @unit ms(milliseconds)
	 * */
	staleTime?: number;

	/**
	 * when the cache is stale,
	 * time to allow to place an old api(instead of loader for ui) while querying new one
	 * @unit ms(milliseconds)
	 * */
	extraCacheTime?: number;
};
export interface QueryAction<Payload = any> {
	type: string;
	payload: Payload;
}

export type SubjectInitCreator<State> = (
	set: (s: SetStatePayload<State>) => void,
	get: () => State,
	subscribe: (fn: (s: State) => void) => () => void
) => State;

export interface BoundSubject<State> extends GetStateWithSelector<State> {
	subscribe: (fn: (s: State) => void) => () => void;
	setState: (fn: SetStatePayload<State>) => void;
	destroy: () => void;
}

/**
 * @types: Query
 */
export type QueryState<State, Deps = any> = {
	/**
	 * only when the latest one has error
	 * */
	error: Error | null;
	/**
	 * data from successful query
	 * */
	data: State;
	
	/**
	 * lastly successes query parameter
	 * */
	dataDeps: Deps | undefined;
	
	/**
	 * lastly requested query arguments, it can be in progress
	 * lastDeps === dataDeps means
	 * no query is in process & last one was successful
	 
	 * lastDeps !== dataDeps means
	 * */
	lastDeps: Deps | undefined;
	
	/**
	 * query function is being called
	 * */
	isFetching: boolean;
	
	/**
	 * no cache found and query function is being called
	 * isLoading === false && isFetching === true
	 * means you have proper api for current deps to show before new query finishes
	 *
	 * isLoading === true && isFetching === true
	 * means you do not have proper api for current deps to show before new query finishes
	 * */
	isLoading: boolean;
	
	isRefetching: boolean;
	
	/**
	 * query function has been called
	 * */
	initiated: boolean;

};

export type CreateQueryProps<State, Deps> = {
	// BASE OPTION
	storeName?: string; // easy to recognize
	initData: State;

	// QUERY OPTION
	/**
	 * query function
	 * */
	query: (
		/**
		 * dependencies for query, it is used to generate cacheKey
		 * */
		deps: Deps
	) => Promise<State>;

	/**
	 * on query error, extra times to retry
	 * noRetry = 0
	 * */
	retryCount?: number;

	/**
	 * on retry delay for another try
	 * @unit ms(milliseconds)
	 * */
	retryInterval?: number;

	// REFETCH OPTION
	/**
	 * on network reconnect by window online, offline flag
	 * only if the cache is stale re-query with the latest deps
	 * better to use it with staleTime, otherwise it always proceeds
	 * */
	refetchOnReconnect?: boolean;

	/**
	 * on document visibility change
	 * only if the cache is stale re-query with the latest deps
	 * better to use it with staleTime, otherwise it always proceeds
	 * */
	refetchOnVisibilityChange?: boolean;

	/**
	 * cache hash key to identify a cache
	 * better to use one for performance
	 * default is shallowEqual compare
	 * */
	cacheKeyBy?: CacheItemKeyBy;

	/**
	 * can create group for cache
	 * default has only 1 group.
	 * to identify more cache group create cacheGroupBy
	 * default is () => $storeName
	 * */
	cacheGroupBy?: CacheGroupKeyBy;
};

export type QueryErrorListener<Deps> = (props: { error: Error; deps: Deps; queryId: string }) => void;
export type QueryDataListener<State, Deps> = (props: {
	data: State;
	deps: Deps;
	queryId: string;
	fromCache: boolean;
}) => void;

export interface BoundQuery<State, Deps> extends BoundSubject<QueryState<State, Deps>> {
	fetchQuery: (p: Deps extends undefined ? void : Deps, forceRenewCache?: boolean) => string;
	refetchQuery: () => string;
	setState: never;
	stopInterval: () => void;
	startInterval: (ms: number) => void;
	/**
	 * subscribe for only query success api
	 * **/
	subscribeData: (fn: QueryDataListener<State, Deps>) => () => void;
	/**
	 * subscribe for only query error api
	 * **/
	subscribeError: (fn: QueryErrorListener<Deps>) => () => void;
	/**
	 * check the query is in progress
	 * with the returned value of fetchQuery or refetchQuery
	 * **/
	isActiveQuery: (queryId: string) => boolean;
	duplicateQuery: () => BoundQuery<State, Deps>;
	clearCache: () => void;
}

export interface BoundSubjectFromQuery<State, Deps = unknown> extends BoundSubject<State> {
	sync: () => void;
	query: BoundQuery<State, Deps>;
	init: (fn: (current: State, next: State) => State) => () => void;
	isSynced: (isEqual?: (a: State, b: State) => boolean) => boolean;
}

export type CacheDirection = 'forwards' | 'backwards'
