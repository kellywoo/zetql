import {
  BoundInfinite,
  CreateInfiniteQueryProps,
  CursorData,
  GetCursorInSeries,
  InfiniteErrorListener,
  InfiniteQueryState,
  InfiniteSuccessListener,
} from './infinite.types.ts';
import { createSubject } from '../create-subject.ts';
import {
  InfiniteQueryFetcher,
  RefetchResponse,
} from './inifinite-query-fetcher.ts';
import { CacheDB } from '../cache/cache-db.ts';
import { InfiniteResultNotifier } from './infinite-result-notifier.ts';
import { CacheGroup } from '../cache/cache-group.ts';
import { CacheDirection } from '../types.ts';

export function createInfiniteQuery<QData, Cursor extends object>({
  query,
  normalize = (s) => {
    return s;
  },
  cursorMode = 'relative',
  staleTime,
  getNextCursor: originNextCursor,
  getPrevCursor: originPrevCursor,
  retryCount = 0,
  retryInterval = 1000,
  refetchErrorSettleMode = 'all-or-none',
  cacheKeyBy = (c) => c,
}: CreateInfiniteQueryProps<QData, Cursor>) {
  type R = ReturnType<typeof normalize>;

  /**
   * cache init: cache can not be removed by cacheTime,
   * partial removal should not be allowed..
   * it only clears all or update partial
   * */
  const cacheDB = new CacheDB<CursorData<QData, Cursor>>({
    extraCacheTime: -1,
    staleTime,
  });

  const placeholderCache = cacheDB.create('*&::p_l_a_c_e_h_o_l_d_e_r::&*');
  let currentCache: CacheGroup<CursorData<QData, Cursor>> = placeholderCache;

  const fetcher = new InfiniteQueryFetcher<QData, Cursor>();
  const resultNotifier = new InfiniteResultNotifier<QData, Cursor>();
  /**
   * subject init
   * */
  const initState = {
    data: normalize([]),
    isFetching: false,
    isRefetching: false,
    isFetchingNext: false,
    isFetchingPrev: false,
    groupKey: placeholderCache.key,
    lastCursor: null,
    error: null,
    nextCursor: null,
    prevCursor: null,
  };
  const subject =
    createSubject<InfiniteQueryState<QData, Cursor, R>>(initState);
  const setState = subject.setState;
  // @ts-ignore
  delete subject.setState;

  const getNextCursor: GetCursorInSeries<QData, Cursor> = (...args) => {
    if (originNextCursor && args[0]) {
      return originNextCursor(...args);
    }
    return null;
  };
  const getPrevCursor: GetCursorInSeries<QData, Cursor> = (...args) => {
    if (originPrevCursor && args[0]) {
      return originPrevCursor(...args);
    }
    return null;
  };

  const getCursors = (groupKey = currentCache.key) => {
    return (
      cacheDB
        .get(groupKey)
        ?.getValues()
        ?.map(({ cursor }) => cursor) || []
    );
  };

  const isAllOrNone = refetchErrorSettleMode === 'all-or-none';

  const normalizeDataWithRange = (
    cacheGroup: CacheGroup<CursorData<QData, Cursor>>
  ) => {
    const cursorDataList = cacheGroup.getValues();
    const leftData = cursorDataList[0];
    const rightData = cursorDataList[cursorDataList.length - 1];
    if (!leftData && !rightData) {
      // incase that range & toUpdate does not exist
      return {
        data: normalize([]),
        nextCursor: null,
        prevCursor: null,
      };
    }

    return {
      data: normalize([...cursorDataList]),
      nextCursor: getNextCursor(rightData, null),
      prevCursor: getPrevCursor(leftData, null),
    };
  };

  const onSuccess = ({
    data,
    cursor,
    groupKey,
    direction,
    abortController,
  }: {
    data: QData;
    cursor: Cursor;
    groupKey: string;
    direction: CacheDirection;
    abortController: AbortController;
  }) => {
    if (groupKey !== currentCache.key || abortController.signal.aborted) {
      return;
    }
    const cursorData = { data, cursor };
    setState((s) => {
      currentCache.appendCache(cacheKeyBy(cursor), cursorData, direction);
      const partial = normalizeDataWithRange(currentCache);
      return {
        ...s,
        ...partial,
        error: null,
        isFetching: false,
        isFetchingPrev: false,
        isFetchingNext: false,
      };
    });
    resultNotifier.notifySuccess(cursorData);
  };

  const onError = ({
    cursor,
    error,
    groupKey,
    abortController,
  }: {
    cursor: Cursor;
    error: Error;
    groupKey: string;
    abortController: AbortController;
  }) => {
    if (groupKey !== currentCache.key || abortController.signal.aborted) {
      return;
    }
    const cursorErrorData = { error, cursor };
    const values = currentCache.getValues();
    const prevData = values[0] || null;
    const nextData = values[values.length - 1] || null;
    setState({
      isFetching: false,
      isFetchingPrev: false,
      isFetchingNext: false,
      error: cursorErrorData,
      nextCursor: getNextCursor(nextData, cursorErrorData),
      prevCursor: getPrevCursor(prevData, cursorErrorData),
    });
    resultNotifier.notifyError(cursorErrorData);
  };

  const fetchInner = (cursor: Cursor, direction: CacheDirection) => {
    const { groupKey } = subject();
    fetcher.fetch(
      {
        query,
        cursor,
        retryCount,
        retryInterval,
        direction,
        groupKey,
        abortController: new AbortController(),
      },
      { onSuccess, onError }
    );
  };

  const settleRefetch = (
    cache: CacheGroup<CursorData<QData, Cursor>>,
    { hasError, data }: RefetchResponse<QData, Cursor>,
    abortController: AbortController
  ) => {
    if (abortController.signal.aborted) {
      return;
    }
    if (hasError && isAllOrNone) {
      setState({ isRefetching: false });
      return;
    }
    // hasError & partial => before error
    // noError
    if (cursorMode === 'relative') {
      cache.clear();
      for (let i = 0; i < data.length; i++) {
        const res = data[i];
        // only keep anything before error
        if (!res.data) {
          break;
        }
        cache.appendCache(cacheKeyBy(res.cursor), {
          cursor: res.cursor,
          data: res.data as QData,
        });
      }
    } else {
      data.forEach((res, i) => {
        if (res.data) {
          cache.updateCache(cacheKeyBy(res.cursor), {
            cursor: res.cursor,
            data: res.data as QData,
          });
        }
      });
    }
    if (cache === currentCache) {
      setState((s) => {
        return {
          ...s,
          isRefetching: false,
          ...normalizeDataWithRange(currentCache),
        };
      });
    }
  };
  const refetchWithStaticCursors = (
    cursors: Array<Cursor>,
    condition?: (c: Cursor) => boolean
  ) => {
    if (!cursors.length) {
      return;
    }
    setState({ isRefetching: true });
    const abortController = new AbortController();
    const cache = currentCache;
    return fetcher
      .refetchWithStaticCursors({
        query,
        cursors,
        retryCount,
        condition,
        abortController,
        isAllOrNone,
      })
      .then((response) => {
        settleRefetch(cache, response, abortController);
      });
  };
  const refetchWithFlexCursors = (
    cursors: Array<Cursor>,
    condition?: (c: Cursor) => boolean
  ) => {
    if (!cursors.length) {
      return;
    }
    setState({ isRefetching: true });
    const abortController = new AbortController();
    const cache = currentCache;
    return fetcher
      .refetchWithFlexCursors({
        query,
        cursors,
        retryCount,
        condition,
        abortController,
        isAllOrNone,
        getNextCursor,
      })
      .then((response) => {
        settleRefetch(cache, response, abortController);
      })
      .catch((err) => {
        if (cache === currentCache && !abortController.signal.aborted) {
          setState({ isRefetching: false });
        }
      });
  };
  const clearCacheAndRange = (groupKey?: string) => {
    if (typeof groupKey === 'string') {
      cacheDB.clear(groupKey);
    } else {
      cacheDB.clear();
    }
  };

  const infiniteSubject = subject as BoundInfinite<QData, Cursor, R>;

  infiniteSubject.getCursors = getCursors;

  infiniteSubject.fetchQuery = (
    cursor: Cursor | ((c: Cursor | null) => Cursor),
    groupKey = ''
  ) => {
    /**
     * currentCache changes only by fetchQuery
     * **/
    if (!cursor || !['object', 'function'].includes(typeof cursor)) {
      debugger;
      console.error(
        'cursor should have object form, otherwise keep it in object form'
      );
      return;
    }
    const isSameCache = currentCache.key === groupKey;
    if (!isSameCache) {
      currentCache = cacheDB.get(groupKey) || cacheDB.create(groupKey);
    }

    // 1. reset everything and start from the start
    // 2. use old cache and the range
    // 3. reset everything and start from specific cursor
    const cacheValues = currentCache.getValues();
    const cursorFlag = cacheValues[0]?.cursor || null;
    const requestedCache =
      typeof cursor === 'function'
        ? (cursor as (c: Cursor | null) => Cursor)(cursorFlag)
        : cursor;
    const useCache = cursorFlag && requestedCache === cursorFlag;
    // if returned cursor is same as the origin one by reference, it will keep the cache
    // otherwise it will reset all cache
    if (useCache) {
      setState({
        ...normalizeDataWithRange(currentCache),
        isFetching: false,
        isFetchingPrev: false,
        isFetchingNext: false,
        groupKey,
        error: null,
      });
      return;
    }
    cacheDB.clear(groupKey);
    setState({
      ...normalizeDataWithRange(currentCache),
      isFetching: true,
      isFetchingPrev: false,
      isFetchingNext: false,
      lastCursor: requestedCache,
      groupKey,
      error: null,
    });
    fetchInner(requestedCache, 'forwards');
  };

  infiniteSubject.refetchQuery = (condition) => {
    if (!infiniteSubject.isInitiated()) {
      return;
    }
    const hasStaticCursor = cursorMode === 'static';
    const cursors = getCursors();
    if (hasStaticCursor) {
      refetchWithStaticCursors(cursors, condition);
    } else {
      refetchWithFlexCursors(cursors, condition);
    }
  };
  infiniteSubject.isInitiated = () => {
    return currentCache !== placeholderCache && !!currentCache.hasCache();
  };

  infiniteSubject.refetchStale = () => {
    if (!infiniteSubject.isInitiated()) {
      return;
    }
    const hasStaticCursor = cursorMode === 'static';
    if (hasStaticCursor) {
      const cursors = currentCache.getStaleValues().map(({ cursor }) => cursor);
      refetchWithStaticCursors(cursors);
    } else if (currentCache.getAnyStale()) {
      const cursors = getCursors();
      refetchWithFlexCursors(cursors);
    }
  };

  infiniteSubject.fetchNext = () => {
    if (!infiniteSubject.isInitiated()) {
      return;
    }
    const { isFetching, nextCursor, isRefetching } = subject();
    if (isFetching || isRefetching || !nextCursor) {
      return;
    }

    setState({
      isFetching: true,
      error: null,
      isFetchingNext: true,
      isFetchingPrev: false,
    });
    fetchInner(nextCursor, 'forwards');
  };

  infiniteSubject.fetchPrev = () => {
    if (!infiniteSubject.isInitiated()) {
      return;
    }
    const { isFetching, prevCursor, isRefetching } = subject();
    if (isFetching || isRefetching || !prevCursor) {
      return;
    }
    setState({
      isFetching: true,
      error: null,
      isFetchingPrev: true,
      isFetchingNext: false,
    });
    fetchInner(prevCursor, 'backwards');
  };

  infiniteSubject.subscribeData = (
    fn: InfiniteSuccessListener<QData, Cursor>
  ) => {
    return resultNotifier.subscribeData(fn);
  };
  infiniteSubject.subscribeError = (fn: InfiniteErrorListener<Cursor>) => {
    return resultNotifier.subscribeError(fn);
  };
  infiniteSubject.resetCache = (groupKey?: string) => {
    if (typeof groupKey === 'string') {
      clearCacheAndRange(groupKey);
      if (currentCache.key === groupKey) {
        setState(initState);
        currentCache = placeholderCache;
      }
    } else {
      clearCacheAndRange();
      setState(initState);
      currentCache = placeholderCache;
    }
  };
  return infiniteSubject;
}
