import { CreateInfiniteQueryProps, CursorData } from './infinite.types.ts';
import { CacheDirection } from '../types.ts';

type QueryResource<QData, Cursor> = {
	query: CreateInfiniteQueryProps<QData, Cursor>['query'];
	cursor: Cursor;
	direction: CacheDirection;
	retryCount: number;
	retryInterval: number;
	abortController: AbortController;
};
type RefetchResource<QData, Cursor> = {
	query: CreateInfiniteQueryProps<QData, Cursor>['query'];
	retryCount: number;
	cursors: Array<Cursor>;
	condition?: (c: Cursor) => boolean;
	abortController: AbortController;
	isAllOrNone: boolean;
};
type QueryCallBack<QData, Cursor> = {
	onSuccess: (prop: {
		cursor: Cursor;
		data: QData;
		groupKey: string;
		direction: CacheDirection;
		abortController: AbortController;
	}) => void;
	onError: (props: {
		cursor: Cursor;
		error: Error;
		direction: CacheDirection;
		groupKey: string;
		abortController: AbortController;
	}) => void;
};
export type RefetchCursorData<QData, Cursor> = {
	cursor: Cursor;
	data: QData | null;
	error: Error | null;
};

export type RefetchResponse<QData, Cursor> = {
	hasError: boolean;
	data: Array<RefetchCursorData<QData, Cursor>>;
};
export class InfiniteQueryFetcher<QData, Cursor> {
	fireQuery({
		query,
		cursor,
		retryCount,
		abortController,
		retryInterval,
	}: Omit<QueryResource<QData, Cursor>, 'direction'>): Promise<QData> {
		return query(cursor).catch((error) => {
			if (retryCount > 0) {
				return new Promise((resolve, reject) => {
					const setTimer =
						retryInterval === 0
							? (fn: () => void, n?: number) => {
									fn();
							  }
							: setTimeout;
					setTimer(() => {
						this.fireQuery({
							query,
							cursor,
							abortController,
							retryCount: retryCount - 1,
							retryInterval,
						})
							.then(resolve)
							.catch(reject);
					}, retryInterval);
				});
			} else {
				throw error;
			}
		});
	}
	fetch(
		{
			query,
			cursor,
			groupKey,
			abortController,
			direction,
			retryCount,
			retryInterval,
		}: QueryResource<QData, Cursor> & { groupKey: string },
		{ onSuccess, onError }: QueryCallBack<QData, Cursor>
	) {
		this.fireQuery({
			query,
			cursor,
			abortController,
			retryCount,
			retryInterval,
		})
			.then((data) => {
				onSuccess({ cursor, data, groupKey, abortController, direction });
			})
			.catch((error) => {
				onError({ error, cursor, groupKey, abortController, direction });
			});
	}
	private splitCursors<T>(cursors: T[], num: number) {
		const arr = [];
		let i = 0;
		while (i < cursors.length) {
			arr.push(cursors.slice(i, i + num));
			i += num;
		}
		return arr;
	}

	refetchWithFlexCursors({
		query,
		cursors,
		condition,
		retryCount,
		abortController,
		getNextCursor,
	}: RefetchResource<QData, Cursor> & {
		getNextCursor: Exclude<
			CreateInfiniteQueryProps<QData, Cursor>['getNextCursor'],
			undefined
		>;
	}): Promise<RefetchResponse<QData, Cursor>> {
		const loop = (
			cursors: Array<Cursor>,
			response: RefetchResponse<QData, Cursor>,
			i: number,
			cd?: CursorData<QData, Cursor>
		): Promise<RefetchResponse<QData, Cursor>> => {
			if (cursors.length <= i || abortController.signal.aborted) {
				return Promise.resolve(response);
			}
			const cursor = cd ? getNextCursor(cd, null) : cursors[i];
			if (!cursor) {
				return Promise.resolve(response);
			}
			return this.fireQuery({
				query,
				cursor,
				abortController,
				retryCount,
				retryInterval: 0,
			})
				.then((data) => {
					const cd = { cursor, data, error: null };
					response.data.push(cd);
					if (!condition || condition(cursor)) {
						return loop(cursors, response, i + 1, cd);
					} else {
						return response;
					}
				})
				.catch((error) => {
					response.data.push({ cursor, data: null, error });
					response.hasError = true;
					// if any error occurs stop immediately
					return response;
				});
		};
		return loop(cursors, { hasError: false, data: [] }, 0);
	}
	refetchWithStaticCursors({
		query,
		cursors: originCursors,
		retryCount,
		abortController,
		isAllOrNone,
		condition,
	}: RefetchResource<QData, Cursor>): Promise<RefetchResponse<QData, Cursor>> {
		const cursors = condition ? originCursors.filter(condition) : originCursors;
		const splited = this.splitCursors(cursors, 6);
		const loop = (
			segs: Cursor[][],
			response: RefetchResponse<QData, Cursor>,
			i: number
		): Promise<RefetchResponse<QData, Cursor>> => {
			if (!segs[i]?.length || abortController.signal.aborted) {
				return Promise.resolve(response);
			}
			return Promise.allSettled(
				segs[i].map((cursor) => {
					return this.fireQuery({
						query,
						cursor,
						abortController,
						retryCount,
						retryInterval: 0,
					});
				})
			).then((results) => {
				results.forEach((data, j) => {
					const cursor = segs[i][j];
					if (data.status === 'fulfilled') {
						response.data.push({ cursor, data: data.value, error: null });
					} else {
						response.hasError = true;
						response.data.push({ cursor, data: null, error: data.reason });
					}
				});
				if (response.hasError && isAllOrNone) {
					return response;
				}
				return loop(segs, response, i + 1);
			});
		};
		return loop(splited, { hasError: false, data: [] }, 0);
	}
}
