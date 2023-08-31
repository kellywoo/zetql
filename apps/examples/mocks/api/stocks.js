import stockList from '../resource/stock.json';

export const stockStaticCursorApi = {
	url: '/stocks-static-cursor',
	getHandler: (req) => {
		const offset = Number(req.queryParams.offset) || 1;
		const size = Number(req.queryParams.size) || 50;
		const startIndex = Math.max(offset - 1, 0);
		const endIndex = startIndex + size;
		const data = stockList.slice(startIndex, endIndex);
		return {
			data,
			hasNext: endIndex <= stockList.length,
		};
	},
};

export const stockRelativeCursorApi = {
	url: '/stocks-relative-cursor',
	getHandler: (req) => {
		const offset = Number(req.queryParams.offset) || 1;
		const size = 10 + Math.floor(Math.random() * 10);
		const startIndex = Math.max(offset, 0);
		const endIndex = startIndex + size;
		const data = stockList.slice(startIndex, endIndex);
		return {
			data,
			nextCursor: endIndex < stockList.length ? endIndex : undefined,
		};
	},
};
