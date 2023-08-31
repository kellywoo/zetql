# @zetql/core (vanila)

No boilerplate<br />
Light and Easy state management library. <br/>
Inspired by Zustand and react-query. (and some naming from rxjs)

## Feature
1. Simple state manager (subject)
2. Easy cache management and Share (cache)
3. Fetch and Refetch System for query management (query)
4. infinite paging management (infiniteQuery)
5. pure vanilla & no boiler plate
6. Easy implementation

## `Subject`
Simple State Manager

createSubject takes `object` or `function returning object` as its argument to create init data

```typescript
const subject = createSubject({isOpen: true})
```
```typescript
const subject = createSubject( (set, get, subscribe) => ({ isOpen: true}) )
```
### getter

```typescript
const state = subject() // { isOpen: true }
// or you can take projector to select the state you only want
const isOpen = subject((s) => s.isOpen )
```


### 1. static setter
```typescript
import { createSubject } from '@zetql/core';

export const detailModalSubject = createSubject<{
  isOpen: boolean;
}>({ isOpen: false });

const { isOpen } = detailModalSubject();
// also you can use projector like the below.
// const isOpen = detailModalSubject((s) => s.isOpen)
const closeModal = () => detailModalSubject.setState({ isOpen: false });

const unsubscribe = detailModalSubject.subscribe(({ isOpen }) => {
  alert(isOpen ? 'modal is open' : 'modal is closed');
});
```

### 2. method setter
```typescript
import { createSubject } from '@zetql/core';

export const detailModalSubject = createSubject<{
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}>((set) => {
  return {
    isOpen: false,
    openModal: () => {
      set({ isOpen: true });
    },
    closeModal: () => {
      set({ isOpen: false });
    },
    toggleModal: () => {
      set((state) => {
        return { ...state, isOpen: !state.isOpen };
      });
    },
  };
});
const { isOpen, openModal, closeModal, toggleModal } = detailModalSubject();
```


## `QuerySubject`
Fetch and Refetch System of query management

### fetchQuery & refetchQuery
- fetchQuery: fetchQuery if the cache is stale
- refetchQuery: calls fetchQuery with lately executed params (regardless its result whether it succeeded or failed)

```typescript
import { createQuery } from '@zetql/core';
import { CouponInterface } from '...'

interface CouponListState {
  coupons: Array<CouponInterface>;
}

export const couponQuery = createQuery<CouponListState, void>({
  query: () => {
    return fetch('/coupons')
      .then(({ data }) => {
        return { coupons: data };
      })
  },
  initData: { coupons: [] },
});

const state1 = couponQuery();
// {
//   error: null, 
//   data: { coupons: [] }, 
//   dataDeps: undefined, 
//   lastDeps: undefined, 
//   isFetching: false, 
//   isLoading: false, 
//   isRefetching: false, 
//   initiated: false
// }
couponQuery.fetchQuery();
const fetchingStatus = couponQuery();
// { ..., 
// isFetching: true, // query fetching it
// isRefetching: false, 
// ...}
...
couponQuery.refetchQuery();

const refetchingStatus = couponQuery();
// { ..., 
// isFetching: true,
// isRefetching: true, 
// ...}
```

### QueryState
```typescript
type QueryState<State, Deps = any> = {
/**
 * only when the latest one has error
 */
error: Error | null;
/**
 * data from successful query
 */
data: State;

/**
 * lastly successes query parameter
 */
dataDeps: Deps | undefined;
/**
 * lastly requested query arguments, it can be in progress
 * lastDeps === dataDeps means
 * no query is in process & last one was successful
 * lastDeps !== dataDeps means
*/
lastDeps: Deps | undefined;

/**
 * query function is being called
 */
isFetching: boolean;

/**
 * no cache found and query function is being called
 * isLoading === false && isFetching === true
 * means you have proper api for current deps to show before new query finishes
 *
 * isLoading === true && isFetching === true
 * means you do not have proper api for current deps to show before new query finishes
 */
isLoading: boolean;
  
/**
* refetching flag
* */
isRefetching: boolean;

/**
 * query function has been called
 * */
initiated: boolean;
};
```


### subscribe To State
- `subscribe`: subscribe to every change of the state
- `subscribeData`: subscribe to only data
- `subscribeError`: subscribe to only error
```typescript
couponQuery.subscribe((state) => {
  console.log(state);
});
couponQuery.subscribeData((state) => {
  // only subscribe to data update
  console.log(state);
  // { data: {coupons: [....]},
  //   deps: undefined,
  //   queryId: '...',
  //   fromCache: false,
  // }
});
couponQuery.subscribeError((state) => {
  // only subscribe to error update
  console.log(state);
  // { error: Error; deps: undefined; queryId: '...' }
});

const { fetchQuery } = couponQuery;
const queryId = fetchQuery();
couponQuery.isActiveQuery(queryId)
// true
```


### Query Retry Strategy
- retryCount: query retry count when the query is failed
- retryInterval: intervalTime between retries(ms)
```typescript
export const couponQuery = createQuery<CouponListState, void>({
  query: () => {
    //....
  },
  initData: { coupons: [] },
  retryCount: 2, // another 2times, default is 0
  retryInterval: 300, // 300ms
});
```

### Query Refetch Strategy
```typescript

export const couponQuery = createQuery<CouponListState, void>({
  query: () => {
    //...
  },
  initData: { coupons: [] },
  refetchOnReconnect: true, 
  refetchOnVisibilityChange: true,
});
// refetchOnReconnect & refetchOnVisibilityChange
// check cache is stale, only when cache is stale refetch is processing


// looping refetch
const { startInterval, stopInterval } = couponQuery
startInterval(3000)
startInterval(5000) // only keep one interval
stopInterval()
```

### Query Cache
querySubject takes cache options to create cache
- staleTime(ms): span of time that one query data is valid
- extraCacheTime(ms): how long cache can be kept once the data are stale

Even a cache is stale, you can use it as placeholder before new query is executed.
if there is no cache from data, previous data would be displayed.
If we found the cache, it turns `isLoading` flag on as well as `isFetching`

```typescript
import { couponQuery } from "examples/src/subjects/coupon/coupon.query";

export const couponQuery = createQuery<CouponListState, undefined>({
  query: fetchCoupons,
  initData: { coupons: [] },
}, {
  staleTime: 10 * 60_000, // 10minutes 
  extraCacheTime: 10 * 60_000 // another 10minutes to keep it
});

/**
 * the cache is stale but extraCacheTime is still valid
 */
couponQuery.fetchQuery()
console.log(couponQuery())
// {..., isFetching: true, isLoading: false}

/**
 * both statleTime & extraCacheTime have passed
 */
couponQuery.fetchQuery()
console.log(couponQuery())
// { isFetching: true, isLoading: true }

```
- isFetching: query is activated with/out stale cache available
- isLoading:  query is activated without stale cache available

### Query Cache Key
cache can be grouped by cacheGroupBy
it should return string.
Also cacheKey can be anything and is compared by shallowEqual.
For the sakes of performance, better to set `cacheKeyBy`.

```typescript
export const couponQuery = createQuery<CouponListState, {size: number}>({
  query: fetchCoupons,
  initData: { coupons: [] },
  cacheKeyBy: (a) => a,
  cacheGroupBy: ({ size }) => size.toString()
}, {
  staleTime: 10 * 60_000, // stale cache for 10minutes
  extraCacheTime: 10 * 60_000 // 10minutes cacheing for stale cache
});

```

### Query Cache Share
cache can be shared among querySubjects.
instead of cache options, you can create cacheDB and pass it as cache option

```typescript
import { createCacheDB } from '@zetql/core'

const projectCache = createCacheDB(
  {
    staleTime: 10 * 60_000,
    extraCacheTime: 10 * 60_000
  }
)
const fetchProject = ({ projectName }) => {
  //....
}

export const panelProject = createQuery<ProjectData, { projectName: string }>({
  query: fetchCoupons,
  cacheKeyBy: ({projectName}) => projectName,
  initData: { data: null },
}, projectCache );

export const mainProject = createQuery<ProjectData, { projectName: string}>({
  query: fetchCoupons,
  cacheKeyBy: ({projectName}) => projectName,
  initData: { data: null },
}, projectCache);

```

## `Infinite Query Subject`
InfiniteQuery is working for infinitePagination.
It takes cursor(which means param of the query and should have form of object) to call
and takes `getNextCursor` and `getPrevCursor` to execute pagination.
To initiate the query use `fetchQuery` and `fetchNext` to call next(`fetchPrev` to call prev).
If `getNextCursor` or `getPrevCursor` is not provided, `fetchNext` and `fetchPrev` would not work respectfully.

```typescript
import { createInfiniteQuery } from '@zetql/core';
interface StockList {
  stocks: Array<StockModel>;
  nextCursor: number | undefined;
}
const fetchStocks: (param?: {
  offset: number | undefined;
}) => Promise<StockList> = (offset) => {
  const url =`/stocks-relative-cursor${
    typeof offset?.offset === 'number' ? `?offset=${offset?.offset}` : ''
  }`
  return fetch(url).then(({ data, nextCursor }) => {
    return { stocks: data, nextCursor };
  });
};

const stockQuery = createInfiniteQuery<
  StockList,
  { offset: number | undefined }
>({
  query: fetchStocks,
  normalize: (pages) => {
    return pages.reduce((p: StockModel[], c) => {
      return p.concat(c.data.stocks);
    }, []);
  },
  cacheKeyBy(cursor){
    return cursor.offset
  },
  getNextCursor: ({ cursor, data }) => {
    return data.nextCursor ? { offset: data.nextCursor } : null;
  }
});
const { fetchNext, fetchQuery } = stockQuery;
fetchQuery({ offset: 0 });
fetchNext();

```

### getNextCursor | getPrevQuery
CursorCreator is function to provide prev or next cursor.
It gets endcursor(the last success data at the edge) and error if error occurred.
For instance, getNextCursor gets the last success data of forwards direction.

```typescript
type CursorCreator<QData, Cursor> =  (
  endCursor: { data: QData; cursor: Cursor },
  errorData: { error: Error; cursor: Cursor } | null
) => Cursor | null;
```

### CursorMode
cursorMode can be `static` or `relative`.

`static` means parameter for the query is already decided depends on which page is requested like the typical pagination.
Also you are sure that the response is pretty identical.
```typescript
// this is static cursor
fetchPage({ size: 30, page: 2 })
fetchPage({ size: 30, page: 3 })
// it is always 3 after 2
```
`relative` means depends on the response the request would be different, and response can be vary time to time and it is critical.
```typescript
// relative
const response = await fetchPage({ cursor: 0 });
// { data: [...], nextCursor: 10 }
fetchPage({ cursor: response.nextCursor });
// cursor can be different depend on the response
```
cursor mode can be critical to call `refetchQuery` and `refetchStale`.
In `static` cursorMode, refetching query would work in parallel and regardless of status of the prev query(fail or success), it keeps refetching to the end.
Also if

<table>
<tr>
<th></th>
<th>static</th>
<th>relative</th>
</tr>
<tr>
<th>Cursor(Parameter)</th>
<td>
independent from response
</td>
<td>
independent | dependent from response
</td>
</tr>

<tr>
<th>Response</th>
<td>
same cursors give identical response
</td>
<td>
can be vary
</td>
</tr>

<tr>
<th>refetchQuery</th>
<td>
pararell (error on previous query does not affect next query)
</td>
<td>
sequential (error on any query stops whole process)
</td>
</tr>

<tr>
<th>refetchStatic</th>
<td>
calls only stale pages
</td>
<td>
if any of query is stale, it executes for all the query
</td>
</tr>
</table>

<blockquote>
Due to complexity and performance of the pagination queries,
stale check should be manually made by calling `refetchStale`
</blockquote>

### refetchErrorSettleMode
on error while refetching queries
- `partial` : it just update partial response <br/>(works only with `cursorMode: static`)
- `all-or-none` : it drops every response

if you'd like to use it for react and want to use hooks, use `@zetql/react` instead

### Using PaginationGroup
Grouping is supported with name passed on fetchQuery
```typescript
fetchQuery({ offset: 0 }, 'size:20');
fetchQuery({ offset: 0 }, 'size:30');
fetchQuery({ offset: 0 }, 'q=la&size=30');
fetchQuery({ offset: 0 }, 'q=la');
```
when you switch groups, if previous query exists, cache can be used by passing function return the cursor it gets,  instead of new cursor.
argument cursor can be null, should return cursor always.
```typescript
/**
 * use cache on switching group
 * */
fetchQuery( (cursor) => {
    if (cursor) {
        return cursor;
    }
    return { page: 1, category: '1' };
}, 'category=1');

/**
 * do not use cache on switching group
 * */
fetchQuery({ page: 1, category: '1' }, 'category=1');
```
### Data Normalize
data from infiniteQuery is stored as array <br/>
Array<{ cursor, data }>
normalize is projector to change these forms.

```typescript
/**
 * without normalize
 * */
const stockQuery = createInfiniteQuery<StockModel>({
  // ...
});
stockQuery().data
// [ { stocks: ... }, ... ]

/**
 * with normalize
 * */
const noramlizedStockQuery = createInfiniteQuery({
  normalize: (pages) => {
    return pages.reduce((p: StockModel[], c: StockModel) => {
      return p.concat(c.data.stocks);
    }, []);
  },
  // ...
});
noramlizedStockQuery().data
// [...]

```
### Infinite Query State



```typescript
interface InfiniteQueryState<QData, Cursor, Normalized> {
  data: Normalized;
  isFetching: boolean;
  isFetchingNext: boolean;
  isFetchingPrev: boolean;
  isRefetching: boolean;
  groupKey: string;  // current group key
  lastCursor: Cursor | null;
  nextCursor: Cursor | null;
  prevCursor: Cursor | null;
  error: CursorErrorData<Cursor> | null;
}
```
