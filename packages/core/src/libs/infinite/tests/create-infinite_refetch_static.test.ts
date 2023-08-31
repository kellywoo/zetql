import { createInfiniteQuery } from '../create-infinite-query';
import {
	CreateInfiniteQueryProps,
	RefetchErrorSettleMode,
} from '../infinite.types';

type ResData = {
	offset: number;
};
type ReqData = {
	offset: number;
};

describe('static cursor refetch process', () => {
	const createFlexCursorQuery = (
		createError?: () => boolean,
		props?: Partial<CreateInfiniteQueryProps<ResData, ReqData>>
	) =>
		createInfiniteQuery<ResData, ReqData>({
			query({ offset }) {
				return new Promise((res, rej) => {
					if (createError?.()) {
						rej(new Error('error'));
					} else {
						res({ offset: offset + 10 });
					}
				});
			},
			retryCount: 0,
			cacheKeyBy: (req) => req.offset,
			getNextCursor: ({ data }) => ({ offset: data.offset }),
			cursorMode: 'static',
			...props,
		});

	it('refetch works in sequential', (done) => {
		const flexCursorQuery = createFlexCursorQuery();
		flexCursorQuery.fetchQuery({ offset: 1 });
		const stack = [];
		flexCursorQuery.subscribeData((state) => {
			stack.push(state);
			const last = stack.length - 1;
			switch (last) {
				case 5:
					const prevCursors = flexCursorQuery.getCursors();
					const len = prevCursors.length;
					flexCursorQuery.refetchQuery();
					flexCursorQuery.subscribe((state) => {
						expect(state.data.length).toBe(len);
						for (let i = 1; i < len; i++) {
							expect(state.data[i - 1].data).toEqual(state.data[i].cursor);
						}
						done();
					});
					break;
				default:
					flexCursorQuery.fetchNext();
			}
		});
	});
	it.skip('refetchStale works in sequential & target for only stale ones', (done) => {
		const flexCursorQuery = createFlexCursorQuery(undefined, {
			staleTime: 100,
		});
		flexCursorQuery.fetchQuery({ offset: 1 });
		const stack = [];
		flexCursorQuery.subscribeData((state) => {
			stack.push(state);
			const last = stack.length - 1;
			switch (last) {
				case 5:
					const prevCursors = flexCursorQuery.getCursors();
					const len = prevCursors.length;
					flexCursorQuery.refetchStale();
					// flexCursorQuery.subscribe((state) => {
					// 	expect(state.data.length).toBe(len);
					// 	for (let i = 1; i < len; i++) {
					// 		expect(state.data[i - 1].data).toEqual(state.data[i].cursor);
					// 	}
					// });
					
					done();
					break;
				default:
					flexCursorQuery.fetchNext();
			}
		});
	});
	it('refetch error with all-or-none mode', (done) => {
		let i = 0;
		const spy = jest.fn();
		const flexCursorQuery = createFlexCursorQuery(
			() => {
				i++;
				const isError = i === 10;
				if (isError) {
					spy();
				}
				return isError;
			},
			{ refetchErrorSettleMode: 'all-or-none' }
		);
		flexCursorQuery.fetchQuery({ offset: 1 }); // 1
		const stack = [];
		flexCursorQuery.subscribeData((state) => {
			stack.push(state);
			const last = stack.length - 1;
			// 2,3,4,5,6,7
			switch (last) {
				case 5:
					const { data: originData } = flexCursorQuery();
					let i = 0;
					flexCursorQuery.subscribe(({ isRefetching, data }) => {
						if (i === 0) {
							expect(spy).toHaveBeenCalledTimes(0);
							expect(isRefetching).toEqual(true);
							i++;
						} else {
							expect(spy).toHaveBeenCalledTimes(1);
							expect(isRefetching).toEqual(false);
							expect(data).toEqual(originData);
							done();
						}
					});
					flexCursorQuery.refetchQuery();
					break;
				default:
					flexCursorQuery.fetchNext();
			}
		});
	});
	it('refetch error with partial mode', (done) => {
		let i = 0;
		const spy = jest.fn();
		const flexCursorQuery = createFlexCursorQuery(
			() => {
				i++;
				const isError = i === 10;
				if (isError) {
					spy();
				}
				return isError;
			},
			{ refetchErrorSettleMode: 'partial' }
		);
		flexCursorQuery.fetchQuery({ offset: 1 }); // 1
		const stack = [];
		flexCursorQuery.subscribeData((state) => {
			stack.push(state);
			const last = stack.length - 1;
			// 2,3,4,5,6,7
			switch (last) {
				case 5:
					const { data: originData } = flexCursorQuery();
					let i = 0;
					flexCursorQuery.subscribe(({ isRefetching, data }) => {
						if (i === 0) {
							expect(spy).toHaveBeenCalledTimes(0);
							expect(isRefetching).toEqual(true);
							i++;
						} else {
							expect(spy).toHaveBeenCalledTimes(1);
							expect(isRefetching).toEqual(false);
							expect(data).toEqual(originData);
							expect(data.length === originData.length).toBe(true);
							done();
						}
					});
					flexCursorQuery.refetchQuery();
					break;
				default:
					flexCursorQuery.fetchNext();
			}
		});
	});
});
