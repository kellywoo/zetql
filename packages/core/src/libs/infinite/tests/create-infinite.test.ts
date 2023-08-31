import { createInfiniteQuery } from '../create-infinite-query';
import { CreateInfiniteQueryProps } from '../infinite.types';

type Param = {
	category: string;
	page: number;
	shouldFail?: boolean;
	noNext?: boolean;
};
type SegData = {
	category: string;
	list: number[];
	hasNext: boolean;
};

const res = Array.from({ length: 16 }, (_, i) => {
	return i + 1;
});
const pageApi = ({ category, page, shouldFail }: Param): Promise<SegData> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (shouldFail) {
				reject(new Error());
			} else {
				resolve({
					category,
					list: res.slice(page * 10 - 10, page * 10),
					hasNext: page * 10 <= res.length,
				});
			}
		}, 1000);
	});
};
const prepare = (props: Partial<CreateInfiniteQueryProps<SegData, Param>>) => {
	return createInfiniteQuery<SegData, Param>({
		query: pageApi,
		getNextCursor: ({ data, cursor }) => {
			return data.hasNext ? { ...cursor, page: cursor.page + 1 } : null;
		},
		getPrevCursor: ({ data, cursor }) => {
			return cursor.page === 1 ? null : { ...cursor, page: cursor.page - 1 };
		},
		normalize: (data) => {
			return data.reduce(
				(p, c) => {
					return { list: [...p.list, ...c.data.list] };
				},
				{ list: [] as number[] }
			);
		},
		retryCount: 2,
		...props,
	});
};

describe('createInfiniteQuery', () => {
	it('default order & getFirstCursor & get endCursor', (done) => {
		jest.useFakeTimers();
		const infiniteQuery = prepare({});
		const stack: any[] = [];
		infiniteQuery.subscribeData((data) => {
			stack.push(data);
			const last = stack.length - 1;
			switch (last) {
				case 0:
					expect(stack[last]).toEqual(
						expect.objectContaining({
							data: {
								category: '1',
								list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
								hasNext: true,
							},
						})
					);
					expect(infiniteQuery().data).toEqual({
						list: res.slice(0, 10),
					});
					infiniteQuery.fetchNext();
					jest.runAllTimers();
					break;
				case 1:
					expect(stack[last]).toEqual(
						expect.objectContaining({
							data: { category: '1', list: res.slice(10), hasNext: false },
						})
					);
					expect(infiniteQuery().data).toEqual({
						list: res,
					});
					expect(infiniteQuery.getCursors()).toEqual([
						{
							page: 1,
							category: '1',
						},
						{
							page: 2,
							category: '1',
						},
					]);
					done();
					break;
			}
		});
		infiniteQuery.fetchQuery( { page: 1, category: '1' }, '1');
		jest.runAllTimers();
	});
});
