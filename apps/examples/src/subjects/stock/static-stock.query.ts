import { fetchClient } from '@/utils/fetchClient.ts';
import { createInfiniteQuery } from '@zetql/react';
import { StockModel } from '@/models/Stock.model.ts';
interface StockList {
  stocks: Array<StockModel>;
  hasNext: boolean;
}
const fetchStocks: ({
  size,
  page,
}: {
  size: number;
  page: number;
}) => Promise<StockList> = ({ size, page }) => {
  return fetchClient(`/stocks-static-cursor?size=${size}&page=${page}`).then(
    ({ data, hasNext }) => {
      return { stocks: data, hasNext };
    }
  );
};
export const staticStockQuery = createInfiniteQuery<
  StockList,
  { size: number; page: number }
>({
  query: fetchStocks,
  cursorMode: 'static',
  normalize: (pages) => {
    return pages.reduce((p: StockModel[], c) => {
      return p.concat(c.data.stocks);
    }, []);
  },
  cacheKeyBy(cursor) {
    return cursor.page;
  },
  getNextCursor: ({ cursor, data }) => {
    return data.hasNext ? { ...cursor, page: cursor.page + 1 } : null;
  },
});
