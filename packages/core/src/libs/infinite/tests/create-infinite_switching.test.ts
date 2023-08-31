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
describe('createInfiniteQuery Switching context', () => {
	it('switching back to first group with latest cursor', (done) => {
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
					/**
					 * fetch next
					 * */
					infiniteQuery.fetchNext();
					jest.runAllTimers();
					break;
				case 1:
					// fetch next
					expect(stack[last]).toEqual(
						expect.objectContaining({
							data: { category: '1', list: res.slice(10), hasNext: false },
						})
					);
					expect(infiniteQuery().data).toEqual({
						list: res,
					});
					/**
					 * switching to the other group
					 * */
					infiniteQuery.fetchQuery( { page: 1, category: '2' }, '2');
					jest.runAllTimers();
					break;
				case 2:
					expect(stack[last]).toEqual(
						expect.objectContaining({
							data: { category: '2', list: res.slice(0, 10), hasNext: true },
						})
					);
					expect(infiniteQuery().data).toEqual({
						list: res.slice(0, 10),
					});
					const cursors = infiniteQuery.getCursors('1');
					expect(cursors).toEqual([{ page: 1, category: '1' }, { page: 2, category: '1' }]);
					/**
					 * switching back to first one with the history
					 * */
					infiniteQuery.subscribe((state)=>{
						// using cache does not trigger subscribeData
						expect(state.data).toEqual({
							list: res,
						});
						done();
					})
					infiniteQuery.fetchQuery( (cursor) => {
						if (cursor) {
							return cursor;
						}
						return { page: 1, category: '1' };
					}, '1');
					jest.runAllTimers();
					break;
			}
		});

		/**
		 * fetch init
		 * */
		infiniteQuery.fetchQuery({ page: 1, category: '1' },'1');
		jest.runAllTimers();
	});

	it('switching back to first group with restart', (done) => {
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
					/**
					 * fetch next
					 * */
					infiniteQuery.fetchNext();
					jest.runAllTimers();
					break;
				case 1:
					// fetch next
					expect(stack[last]).toEqual(
						expect.objectContaining({
							data: { category: '1', list: res.slice(10), hasNext: false },
						})
					);
					expect(infiniteQuery().data).toEqual({
						list: res,
					});
					/**
					 * switching to the other group
					 * */
					infiniteQuery.fetchQuery( { page: 1, category: '2' }, '2');
					jest.runAllTimers();
					break;
				case 2:
					expect(stack[last]).toEqual(
						expect.objectContaining({
							data: { category: '2', list: res.slice(0, 10), hasNext: true },
						})
					);
					expect(infiniteQuery().data).toEqual({
						list: res.slice(0, 10),
					});
					const cursors = infiniteQuery.getCursors('1');
					expect(cursors).toEqual([{ page: 1, category: '1' }, { page: 2, category: '1' }]);
					/**
					 * switching back to first one with restart flag
					 * */
					infiniteQuery.fetchQuery( { page: 2, category: '1' }, '1');
					jest.runAllTimers();
					break;
				case 3:
					expect(stack[last]).toEqual(
						expect.objectContaining({
							data: { category: '1', list: res.slice(10), hasNext: false },
						})
					);
					expect(infiniteQuery().data).toEqual({
						list: res.slice(10),
					});
					done();
					break;
			}
		});

		/**
		 * fetch init
		 * */
		infiniteQuery.fetchQuery( { page: 1, category: '1' },'1');
		jest.runAllTimers();
	});
});
