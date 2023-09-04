import stockList from '../resource/stock.json';

export const stockStaticCursorApi = {
  url: '/stocks-static-cursor',
  getHandler: (req) => {
    const page = Number(req.queryParams.page) || 1;
    const size = Number(req.queryParams.size) || 50;
    const endIndex = stockList.length - Math.max(page - 1, 0) * size;
    const startIndex = endIndex - size;
    const data = stockList.slice(startIndex, endIndex).reverse();
    return {
      data,
      hasNext: startIndex > 0,
    };
  },
};

export const stockRelativeCursorApi = {
  url: '/stocks-relative-cursor',
  getHandler: (req) => {
    const offset = Number(req.queryParams.offset);
    const index = offset
      ? stockList.findIndex(({ id }) => id === offset)
      : stockList.length - 1;
    if (index === -1) {
      throw Error('incorrect offset is given.');
    }
    const size = 10 + Math.floor(Math.random() * 10);
    const endIndex = index + 1;
    const startIndex = Math.max(endIndex - size, 0);
    const data = stockList.slice(startIndex, endIndex).reverse();
    return {
      data,
      nextCursor: startIndex === 0 ? null : stockList[startIndex - 1].id,
    };
  },
};
