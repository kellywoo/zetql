# Zetql



# Work in progress

This is a work in progress, please do not install it in your project yet!!!!

## CreateQuery

### Props

<table width="100%">
<thead>
<tr>
<th width="100px">propName</th>
<th width="200px">type</th>
<th>description</th>
</tr>
</thead>
<tbody>

<tr>
<th>initData</th>
<td>any</td>
<td><b>required</b><br />initial state for view data</td>
</tr>

<tr>
<th>query</th>
<td>function (deps, signal, getState): Observable&lt;any&gt; </td>
<td><b>required</b><br />async operations, for static store you can use it for transformer</td>
</tr>

<tr>
<th>retryTime</th>
<td>number</td>
<td><b>optional</b><br/><b>defaultValue: 0 </b><br />with an error, how many times more tries the query.</td>
</tr>

<tr>
<th>retryInterval</th>
<td>number</td>
<td><b>optional</b><br/><b>defaultValue: 3000ms (unit: ms) </b><br />interval between retries</td>
</tr>

<tr>
<th>staleCheckOnReconnect</th>
<td>boolean</td>
<td><b>optional</b><br/><b>defaultValue: false </b><br />check staleTime has passed on network reconnection</td>
</tr>

<tr>
<th>staleCheckOnVisibilityChange</th>
<td>boolean</td>
<td><b>optional</b><br/><b>defaultValue: false </b><br />check staleTime has passed on document.visibilityState changes</td>
</tr>

<tr>
<th>staleTime</th>
<td>number</td>
<td><b>optional</b><br/>
<b>defaultValue: 0 (ms) </b><br />
cache ttl(time-to-live)
</td>
</tr>

<tr>
<th>intervalTime</th>
<td>number</td>
<td><b>optional</b><br/>milliseconds to refetchQuery (0 means no interval) </tr>

<tr>
<th>cacheKeyBy</th>
<td>function: ((p: any) => any)</td>
<td><b>optional</b><br/><b>defaultValue: ((p: any) => p)</b><br />generate unique id for cache with deps..</td>
</tr>
</tbody>
</table>

```typescript
const personQuery = createQuery<PersonState, PaginationState>({
  query: ({ pageIndex, pageSize }: PaginationState) => {
    return fetchClient(`/api/user?page=${pageIndex}&size=${pageSize}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .catch((e) => {
        throw e;
      }) as Promise<{
      list: Person[];
      pageCount: number;
    }>;
  },
  initData: { list: [], pageCount: 0 },
  retryTime: 3,
});

personQuery.subscribe((s: QueryState<PaginationState>) => {
  console.log(s)
  // 
  type QueryState<S, P = any> = {
    error: Error | null;
    isFetching: boolean;
    isLoading: boolean;
    data: S;
    dataDeps: P | undefined;
    initiated: boolean;
  };
})

```
