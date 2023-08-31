import { BoundSubject } from '../types.ts';

export type CursorData<QData, Cursor> = {
	data: QData;
	cursor: Cursor;
};
export type CursorErrorData<Cursor> = {
	error: Error;
	cursor: Cursor;
};
export type InfiniteErrorListener<Cursor> = (
	props: CursorErrorData<Cursor>
) => void;

export type InfiniteSuccessListener<QData, Cursor> = (
	props: CursorData<QData, Cursor>
) => void;

export type GetCursorInSeries<QData, Cursor> = (
	startCursor: CursorData<QData, Cursor>,
	errorData: CursorErrorData<Cursor> | null
) => Cursor | null;

export type CursorCreator<QData, Cursor> =  (
	startCursor: CursorData<QData, Cursor>,
	errorData: CursorErrorData<Cursor> | null
) => Cursor | null
export type RefetchErrorSettleMode = 'partial' | 'all-or-none';
export type CreateInfiniteQueryProps<QData, Cursor> = {
	/**
	 * query function
	 * */
	query: (cursor: Cursor) => Promise<QData>;
	cursorMode?: 'relative' | 'static';
	getPrevCursor?: CursorCreator<QData, Cursor>;
	getNextCursor?: CursorCreator<QData, Cursor>;
	cacheKeyBy?: (c: Cursor) => any;
	normalize?: (queryDataList: Array<CursorData<QData, Cursor>>) => any;
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
	refetchErrorSettleMode?: RefetchErrorSettleMode;
	staleTime?: number;
};
export interface InfiniteQueryState<QData, Cursor, Normalized> {
	data: Normalized;
	isFetching: boolean;
	isFetchingNext: boolean;
	isFetchingPrev: boolean;
	isRefetching: boolean;
	groupKey: string;
	lastCursor: Cursor | null;
	nextCursor: Cursor | null;
	prevCursor: Cursor | null;
	error: CursorErrorData<Cursor> | null;
}
export interface BoundInfinite<QData, Cursor extends object, Normalized>
	extends BoundSubject<InfiniteQueryState<QData, Cursor, Normalized>> {
	fetchQuery: (
		cursor: Cursor | ((Cursor: Cursor | null) => Cursor),
		queryKey?: string,
	) => void;
	fetchNext: () => void;
	fetchPrev: () => void;
	isInitiated: () => boolean;

	refetchQuery: (condition?: (c: Cursor) => boolean) => void;
	refetchStale: () => void;

	getCursors: (groupKey?: string) => Array<Cursor>;

	setState: never;
	/**
	 * subscribe for only query success api
	 * **/
	subscribeData: (fn: InfiniteSuccessListener<QData, Cursor>) => () => void;
	/**
	 * subscribe for only query error api
	 * **/
	subscribeError: (fn: InfiniteErrorListener<Cursor>) => () => void;
	resetCache: (groupKey?: string) => void;
	// normalizeData: () => void;
}
