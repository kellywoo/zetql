import { fetchClient } from '@/utils/fetchClient.ts';
import { createInfiniteQuery } from '@zetql/react';
import { StockModel } from '@/models/Stock.model.ts';
interface StockList {
	stocks: Array<StockModel>;
	hasNext: boolean;
}
const fetchStocks: ({
	size,
	offset,
}: {
	size: number;
	offset: number;
}) => Promise<StockList> = ({ size, offset }) => {
	return fetchClient(
		`/stocks-static-cursor?size=${size}&offset=${offset}`
	).then(({ data, hasNext }) => {
		return { stocks: data, hasNext };
	});
};
export const staticStockQuery = createInfiniteQuery<
	StockList,
	{ size: number; offset: number }
>({
	query: fetchStocks,
	normalize: (pages) => {
		return pages.reduce((p: StockModel[], c) => {
			return p.concat(c.data.stocks);
		}, []);
	},
	cacheKeyBy(cursor) {
		return cursor.offset;
	},
	getNextCursor: ({ cursor, data }) => {
		return data.hasNext
			? { ...cursor, offset: cursor.offset + cursor.size }
			: null;
	},
});
