import { CacheGroup } from '../cache-group.ts';
import { CacheGroupOption } from '../../types.ts';
import { CacheItem } from '../cache-item';
const realDateNow = Date.now;
let now = Date.now();
describe('cacheGroup', () => {
	const data = Array.from({ length: 4 }, (_, i) => {
		return Object.freeze({ key: i + 1, value: i + 1 });
	});

	beforeAll(() => {
		global.Date.now = jest.fn(() => now);
	});
	afterAll(() => {
		global.Date.now = realDateNow;
	});
	const cacheOption = {
		staleTime: 3600000,
		extraCacheTime: 3000,
	};
	const cacheKeyBy = (s: any) => s.key;
	const createCacheReady = (option: CacheGroupOption) => {
		const cacheGroup = new CacheGroup<{ key: number; value: number }>('1', option) as any;
		cacheGroup.setCache(data[0].key, data[0]);
		cacheGroup.setCache(data[1].key, data[1]);
		cacheGroup.setCache(data[2].key, data[2]);
		return cacheGroup;
	};
	it('#constructor:', () => {
		const option = {
			staleTime: 3600000,
			extraCacheTime: 3000,
		};
		const cacheGroup = new CacheGroup('1', option) as any;
		expect(cacheGroup.staleTime).toEqual(option.staleTime);
		cacheGroup.setCache(data[0].key, data[0]);
		expect(cacheGroup.cacheList.at(-1).hasSameKey(data[0].key)).toEqual(true);
	});
	it('#setCache: add cache at the last of the array', () => {
		const cacheGroup = createCacheReady(cacheOption);
		cacheGroup.setCache(data[3].key, data[3]);
		expect(cacheGroup.cacheList.length).toEqual(4);
		expect(cacheGroup.cacheList[0].hasSameKey(data[0].key)).toBe(true);
	});

	it('#getCache: get the cache', () => {
		const cacheGroup = createCacheReady(cacheOption);
		const cache = cacheGroup.getCache(data[1].key);
		expect(cache.getValue()).toEqual(data[1]);
	});

	it('#setCache: duplication set update the old one', () => {
		const cacheGroup = createCacheReady(cacheOption);
		expect(cacheGroup.cacheList[1].getValue()).toEqual(data[1]);
		cacheGroup.setCache(data[1].key, data[3]);
		expect(cacheGroup.cacheList[1].getValue()).toEqual(data[3]);
	});

	it('#findCache', () => {
		const cacheGroup = createCacheReady(cacheOption);
		const cache = cacheGroup.findCache((cache: CacheItem<any>) => cache.getValue() === data[1]);
		expect(cache.getValue()).toEqual(data[1]);
		const nocache = cacheGroup.findCache((cache: CacheItem<any>) => cache.getValue() === data[3]);
		expect(nocache).toEqual(undefined);
	});

	it('#updateCache: update only when it found the same key, and does not affect the order', () => {
		const cacheGroup = createCacheReady(cacheOption);
		const testCacheKey = data[1].key;
		const index = cacheGroup.findCacheIndex(testCacheKey);
		const prevCache = cacheGroup.cacheList[index];
		expect(prevCache).toBeTruthy();

		now += 3000;
		cacheGroup.updateCache(data[1].key, data[3]);
		expect(cacheGroup.findCacheIndex(testCacheKey)).toEqual(index);
		const currentCache = cacheGroup.cacheList[index];
		expect(prevCache).not.toBe(currentCache);
		expect(cacheGroup.cacheList[index].getValue()).toEqual(data[3]);
		expect(currentCache.expireAt - prevCache.expireAt).toBe(3000);
		now -= 3000;
	});
	it('#cleanUpByCacheTime: normal staleTime and extraCacheTime', () => {
		const cacheGroup = createCacheReady({
			...cacheOption,
			staleTime: 10,
			extraCacheTime: 20,
		});
		const currentCacheList = cacheGroup.cacheList;
		now += 10;
		cacheGroup.cleanUpByCacheTime();
		expect(cacheGroup.cacheList.length).toBe(currentCacheList.length);
		now += 20;
		cacheGroup.cleanUpByCacheTime();
		expect(cacheGroup.cacheList.length).toBe(0);
		now -= 30;
	});
	it('#cleanUpByCacheTime: extraCacheTime -1 does not affect cleanUpByCacheTime event if staleTime has passed', () => {
		const noStaleTimeCacheGroup = createCacheReady({
			...cacheOption,
			staleTime: 10,
			extraCacheTime: -1,
		});
		const currentCacheList = noStaleTimeCacheGroup.cacheList;
		const len = currentCacheList.length;
		now += 10;
		noStaleTimeCacheGroup.cleanUpByCacheTime();
		expect(noStaleTimeCacheGroup.cacheList).toBe(currentCacheList);
		expect(noStaleTimeCacheGroup.cacheList.length).toBe(len);
		now -= 10;
	});
	it('#clear: remove allCache', () => {
		const cacheGroup = createCacheReady({
			...cacheOption,
			staleTime: 3000,
			extraCacheTime: 2000,
		});
		cacheGroup.clear();
		expect(cacheGroup.cacheList.length).toBe(0);
	});
});
