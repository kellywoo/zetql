import { createQuery } from '../create-query';
import { CacheGroup } from '../../cache/cache-group';
import { createCacheDB } from '../../cache/cache-db';

(CacheGroup as any).prototype.originSetCache = CacheGroup.prototype.setCache;
(CacheGroup as any).prototype.originGetCache = CacheGroup.prototype.getCache;
(CacheGroup as any).prototype.originCleanup = CacheGroup.prototype.cleanUpByCacheTime;

const setCache = jest.spyOn(CacheGroup.prototype, 'setCache').mockImplementation(function (...args) {
	// @ts-ignore
	this.originSetCache(...args);
});
const getCache = jest.spyOn(CacheGroup.prototype, 'getCache').mockImplementation(function (...args) {
	// @ts-ignore
	return this.originGetCache(...args);
});
const cleanUpByCacheTime = jest
	.spyOn(CacheGroup.prototype, 'cleanUpByCacheTime')
	.mockImplementation(function (...args) {
		// @ts-ignore
		this.originCleanup(...args);
	});

describe('crateQuery cache setting', () => {
	beforeEach(() => {
		setCache.mockClear();
		getCache.mockClear();
		cleanUpByCacheTime.mockClear();
	});

	it('query process only if previous one is stale', (done: () => void) => {
		const querySpy = jest.fn();
		jest.useFakeTimers();
		const query = createQuery(
			{
				query(param: number) {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							querySpy(param);
							resolve({ calledWith: param });
						}, 3000);
					});
				},
				initData: { calledWith: 0 },
			},
			{
				staleTime: 30 * 1000,
			}
		);
		const stack: any = [];

		const subscription = query.subscribeData((state) => {
			stack.push(state);
			const last = stack.length - 1;
			switch (last) {
				case 0:
					expect(stack[last]).toEqual(
						expect.objectContaining({
							data: { calledWith: 1 },
							fromCache: false,
						})
					);
					expect(querySpy).toHaveBeenCalledTimes(1);
					expect(setCache).toHaveBeenCalledTimes(1);
					query.fetchQuery(2);
					jest.runAllTimers();
					break;
				case 1:
					expect(stack[last]).toEqual(
						expect.objectContaining({
							data: { calledWith: 2 },
							fromCache: false,
						})
					);
					expect(querySpy).toHaveBeenCalledTimes(2);
					expect(setCache).toHaveBeenCalledTimes(2);
					query.fetchQuery(1);
					jest.runAllTimers();

					break;
				case 2:
					expect(stack[last]).toEqual(
						expect.objectContaining({
							data: { calledWith: 1 },
							fromCache: true,
						})
					);

					expect(querySpy).toHaveBeenCalledTimes(2);
					expect(setCache).toHaveBeenCalledTimes(2);

					subscription();
					done();
					break;
			}
		});
		query.fetchQuery(1);
		jest.runAllTimers();
	});
	it('if same cacheDB is injected, they share cache', (done) => {
		jest.useFakeTimers();
		const cacheDB = createCacheDB({
			staleTime: 5 * 6000,
			extraCacheTime: 5 * 60000,
		});
		const sharedQuery1 = createQuery(
			{
				query(number: number) {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve({ number });
						}, 1000);
					});
				},
				initData: { number: 0 },
			},
			cacheDB
		);
		const sharedQuery2 = createQuery(
			{
				query(number: number) {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve({ number });
						}, 1000);
					});
				},
				initData: { number: 0 },
			},
			cacheDB
		);
		sharedQuery1.subscribeData((state) => {
			expect(state).toEqual(
				expect.objectContaining({
					data: { number: 1 },
					fromCache: false,
				})
			);
			sharedQuery2.fetchQuery(1);
			jest.advanceTimersByTime(1000);
		});
		sharedQuery2.subscribeData((state) => {
			expect(state).toEqual(
				expect.objectContaining({
					data: { number: 1 },
					fromCache: true,
				})
			);
			done();
		});
		sharedQuery1.fetchQuery(1);
		jest.advanceTimersByTime(1000);
	});
	it('#duplicate, duplicate the query with the shared cache, ', (done) => {
		jest.useFakeTimers();
		const queryOrigin = createQuery(
			{
				query(number: number) {
					return new Promise((resolve) => {
						setTimeout(() => {
							resolve({ number });
						}, 1000);
					});
				},
				initData: { number: 0 },
			},
			{
				staleTime: 5 * 6000,
				extraCacheTime: 5 * 60000,
			}
		);
		const queryDuplicated = queryOrigin.duplicateQuery();
		queryOrigin.subscribeData((state) => {
			expect(state).toEqual(
				expect.objectContaining({
					data: { number: 1 },
					fromCache: false,
				})
			);
			queryDuplicated.fetchQuery(1);
			jest.advanceTimersByTime(1000);
		});
		queryDuplicated.subscribeData((state) => {
			expect(state).toEqual(
				expect.objectContaining({
					data: { number: 1 },
					fromCache: true,
				})
			);
			done();
		});
		queryOrigin.fetchQuery(1);
		jest.advanceTimersByTime(1000);
	});
});
