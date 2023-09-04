import { fetchClient } from '@/utils/fetchClient.ts';
import { createInfiniteQuery } from '@zetql/react';
import { StockModel } from '@/models/Stock.model.ts';

interface StockList {
  stocks: Array<StockModel>;
  nextCursor: number | undefined;
}
const fetchStocks: (param?: {
  offset: number | undefined;
}) => Promise<StockList> = (offset) => {
  return fetchClient(
    `/stocks-relative-cursor${
      typeof offset?.offset === 'number' ? `?offset=${offset?.offset}` : ''
    }`
  ).then(({ data, nextCursor }) => {
    return { stocks: data, nextCursor };
  });
};
export const relativeStockQuery = createInfiniteQuery<
  StockList,
  { offset: number | undefined }
>({
  query: fetchStocks,
  cursorMode: 'relative',
  normalize: (pages) => {
    return pages.reduce((p: StockModel[], c) => {
      return p.concat(c.data.stocks);
    }, []);
  },
  cacheKeyBy(cursor) {
    return cursor.offset;
  },
  getNextCursor: ({ data }) => {
    return data.nextCursor ? { offset: data.nextCursor } : null;
  },
});
