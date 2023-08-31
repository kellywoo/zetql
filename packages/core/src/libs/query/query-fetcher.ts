import { CreateQueryProps } from '../types.ts';
import { Notifier } from '../utils/notifier.ts';
import { QueryIdManager } from '../utils/query-id-manager.ts';

type QueryResource<State, Deps> = {
	queryIdManager: QueryIdManager;
	query: CreateQueryProps<State, Deps>['query'];
	forceRenewCache?: boolean;
	deps: Deps;
	queryId: string;
	retryCount: number;
	retryInterval: number;
};
type QueryCallback<State, Deps> = {
	onSuccess: (d: { data: State; deps: Deps; queryId: string; fromCache: boolean }) => void;
	onError: (d: { error: Error; deps: Deps; queryId: string }) => void;
};
export class QueryFetcher<State, Deps> {
	// currentQueryId = "";
	// queryIdSet = new Set<string>();
	scheduleRefetch = new Notifier<void>();
	fetch(
		{ queryIdManager, query, deps, queryId, retryCount, retryInterval, forceRenewCache }: QueryResource<State, Deps>,
		{ onSuccess, onError }: QueryCallback<State, Deps>
	) {
		/** 1.Interval */
		this.scheduleRefetch.next();

		/** 2.SetCurrentQuery */
		queryIdManager.setCurrentQueryId(queryId);

		/** 3.Fire Query */
		this.fireQuery(
			{
				queryIdManager,
				query,
				deps,
				queryId,
				retryCount,
				retryInterval,
			},
			{
				onSuccess,
				onError,
			}
		)
			.then((data) => {
				/** 4.Success */
				queryIdManager.markQuerySettled(queryId);
				// set api
				onSuccess({ data, deps, queryId, fromCache: false });
			})
			.catch((error) => {
				if (error instanceof Error) {
					onError({ error, deps, queryId });
				}
			});
	}

	private fireQuery(
		{ queryIdManager, query, deps, queryId, retryCount, retryInterval }: QueryResource<State, Deps>,
		{ onSuccess, onError }: QueryCallback<State, Deps>
	): Promise<State> {
		return query(deps).catch((error) => {
			/** 5.Error */
			const isLatestId = queryIdManager.isCurrentQueryId(queryId);
			if (!isLatestId || retryCount <= 0) {
				queryIdManager.markQuerySettled(queryId);
				if (isLatestId) {
					throw error;
				}
				throw null;
				// ignore
			}
			return new Promise((resolve, reject) => {
				const setTimer = retryInterval === 0 ? (fn: () => void, num?: number) => fn() : setTimeout;
				setTimer(() => {
					const isLatestId = queryIdManager.isCurrentQueryId(queryId);
					if (!isLatestId) {
						queryIdManager.markQuerySettled(queryId);
						return;
					}
					this.fireQuery(
						{
							queryIdManager,
							query,
							deps,
							queryId,
							retryCount: retryCount - 1,
							retryInterval,
						},
						{ onSuccess, onError }
					)
						.then(resolve)
						.catch(reject);
				}, retryInterval);
			});
		});
	}
}
