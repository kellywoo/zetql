import {
	BoundQuery,
	CacheDBOptions,
	CreateQueryProps,
	QueryDataListener,
	QueryErrorListener,
	QueryState,
} from '../types.ts';
import { createSubject } from '../create-subject.ts';
import { uniqueId } from '../utils/uniqueId.ts';
import { visibilityNotifier } from '../utils/visibility-notifier.ts';
import { reconnectNotifier } from '../utils/reconnect-notifier.ts';
import { QueryFetcher } from './query-fetcher.ts';
import { QueryIdManager } from '../utils/query-id-manager.ts';
import { CacheDB, createCacheDB } from '../cache/cache-db.ts';
import { QueryResultNotifier } from '../utils/query-result-notifier.ts';

const requestIdGenerator = uniqueId();
const getRequestId = () => {
	return `${requestIdGenerator()}:::${Date.now()}`;
};
const noop = () => {};
// time for ms

function createQueryInner<State, Deps>(
	props: CreateQueryProps<State, Deps>,
	{
		cacheDB,
		queryFetcher,
	}: {
		cacheDB: CacheDB;
		queryFetcher: QueryFetcher<State, Deps>;
	}
) {
	const {
		query,
		storeName: name,
		initData,
		refetchOnReconnect,
		refetchOnVisibilityChange,
		retryCount = 0,
		retryInterval = 3000,
	} = props;
	const cacheGroupBy = props.cacheGroupBy || (() => 'unique');
	const cacheKeyBy = props.cacheKeyBy || ((a) => a);
	const resultNotifier = new QueryResultNotifier<State, Deps>();
	const queryIdManager = new QueryIdManager();
	const subject = createSubject<QueryState<State, Deps>>({
		data: initData,
		isFetching: false,
		isLoading: false,
		isRefetching: false,
		error: null,
		lastDeps: undefined,
		dataDeps: undefined,
		initiated: false,
	});
	const originDestroy = subject.destroy;
	const setState = subject.setState;

	// @ts-ignore
	delete subject.setState;

	const onSuccess = ({
		data,
		deps,
		queryId,
		fromCache,
	}: {
		data: State;
		deps: Deps;
		queryId: string;
		fromCache: boolean;
	}) => {
		const isLatestId = queryIdManager.isCurrentQueryId(queryId);
		const cacheGroupKey = cacheGroupBy(deps);
		const cacheGroup = cacheDB.get(cacheGroupKey);
		const cacheKey = cacheKeyBy(deps);
		if (!isLatestId || !cacheGroup) {
			cacheGroup?.updateCache(cacheKey, data);
			return;
		}
		if (!fromCache) {
			cacheGroup.setCache(cacheKey, data);
		}
		setState({
			data: data,
			dataDeps: deps,
			lastDeps: deps,
			error: null,
			isFetching: false,
			isRefetching: false,
			isLoading: false,
			initiated: true,
		});
		resultNotifier.notifySuccess({ data, deps, queryId, fromCache });
	};

	const onError = ({ error, deps, queryId }: { error: Error; deps: Deps; queryId: string }) => {
		setState({
			lastDeps: deps,
			error,
			isFetching: false,
			isRefetching: false,
			isLoading: false,
			initiated: true,
		});
		resultNotifier.notifyError({ error, deps, queryId });
	};

	const fetchInner = (deps: Deps, forceRenewCache?: boolean, isRefetching?: boolean) => {
		const queryId = getRequestId();
		const cacheGroupKey = cacheGroupBy(deps);
		const cacheKey = cacheKeyBy(deps);
		const cacheGroup = cacheDB.getSafe(cacheGroupKey);
		cacheGroup.cleanUpByCacheTime();
		const cache = cacheGroup.getCache(cacheKey);
		const useCache = !forceRenewCache && cache && !cache.isOverFreshTime();
		if (cache && useCache) {
			queryIdManager.setCurrentQueryId(queryId);
			onSuccess({
				data: cache.getValue(),
				deps,
				queryId,
				fromCache: true,
			});
			return queryId;
		}
		setState({
			lastDeps: deps,
			initiated: true,
			isFetching: true,
			isRefetching: !!isRefetching,
			isLoading: !cache,
			error: null,
		});
		queryFetcher.fetch(
			{
				query,
				deps,
				queryId,
				queryIdManager,
				retryCount,
				retryInterval,
				forceRenewCache,
			},
			{ onSuccess, onError }
		);
		return queryId;
	};
	const fetchQuery = (deps: Deps = undefined as Deps, forceRenewCache?: boolean) => {
		return fetchInner(deps, forceRenewCache);
	};
	const refetchQuery = () => {
		const { initiated, lastDeps } = subject();
		if (!initiated) {
			console.error('query has not been initiated.');
			return '';
		}
		return fetchInner(lastDeps!, true, true);
	};

	/**
	 * inverval
	 * */
	const intervalRef: {
		intervalTime: number;
		intervalStopped: boolean;
		timer: null | ReturnType<typeof setInterval>;
	} = {
		intervalTime: 0,
		intervalStopped: true,
		timer: null,
	};
	const intervalSubscription = queryFetcher.scheduleRefetch.subscribe(() => {
		clearTimeout(intervalRef.timer as any);
		if (!intervalRef.intervalTime || intervalRef.intervalStopped) {
			return;
		}
		intervalRef.timer = setTimeout(() => {
			refetchQuery();
		}, intervalRef.intervalTime);
	});
	const stopInterval = () => {
		intervalRef.intervalStopped = true;
		clearTimeout(intervalRef.timer as any);
		intervalRef.timer = null;
	};
	const startInterval = (ms: number) => {
		intervalRef.intervalStopped = false;
		intervalRef.intervalTime = ms;
		queryFetcher.scheduleRefetch.next();
	};

	const refetchAfterCheck = () => {
		const { initiated, lastDeps } = subject();
		if (initiated) {
			const cacheGroupKey = cacheGroupBy(lastDeps!);
			const cacheKey = cacheKeyBy(lastDeps!);
			const cacheGroup = cacheDB.get(cacheGroupKey);
			const cacheItem = cacheGroup?.getCache(cacheKey);
			if (cacheItem && cacheItem.isOverFreshTime()) {
				refetchQuery();
			}
		}
	};

	const visibilitySubscription = refetchOnVisibilityChange
		? visibilityNotifier.subscribe(({ value }) => {
				if (value) {
					refetchAfterCheck();
				}
		  })
		: noop;
	const reconnectSubscription = refetchOnReconnect
		? reconnectNotifier.subscribe(({ value }) => {
				if (value) {
					refetchAfterCheck();
				}
		  })
		: noop;
	const destroy = () => {
		originDestroy();
		visibilitySubscription();
		reconnectSubscription();
		intervalSubscription();
		stopInterval();
	};
	const querySubject = subject as BoundQuery<State, Deps>;
	querySubject.fetchQuery = fetchQuery as  BoundQuery<State, Deps>['fetchQuery'];
	querySubject.refetchQuery = refetchQuery;
	querySubject.stopInterval = stopInterval;
	querySubject.startInterval = startInterval;
	querySubject.destroy = destroy;
	querySubject.isActiveQuery = (queryId: string) => {
		return queryIdManager.isActiveQuery(queryId);
	};
	querySubject.subscribeData = (fn: QueryDataListener<State, Deps>) => {
		return resultNotifier.subscribeData(fn);
	};
	querySubject.subscribeError = (fn: QueryErrorListener<Deps>) => {
		return resultNotifier.subscribeError(fn);
	};
	querySubject.duplicateQuery = () => {
		return createQueryInner(props, {
			queryFetcher,
			cacheDB,
		});
	};
	querySubject.clearCache = () => {
		cacheDB.clear();
	};
	return querySubject;
}

export function createQuery<State extends object, Deps = void>(
	props: CreateQueryProps<State, Deps>,
	cacheOptions?: CacheDBOptions | CacheDB
): BoundQuery<State, Deps> {
	const cacheDB = cacheOptions instanceof CacheDB ? cacheOptions : createCacheDB<State>(cacheOptions);
	const queryFetcher = new QueryFetcher<State, Deps>();
	return createQueryInner(props, {
		cacheDB,
		queryFetcher,
	});
}
