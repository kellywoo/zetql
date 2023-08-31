import { CacheItem } from '../cache-item.ts';
let now = Date.now();
const realDateNow = Date.now;
describe('cache item', () => {
	const key = new Set([1, 2, 3]);
	const value = { index: 1 };
	const staleTime = 1000;

	beforeAll(() => {
		global.Date.now = jest.fn(() => now);
	});
	afterAll(() => {
		global.Date.now = realDateNow;
	});
	it('#constructor', () => {
		const cache = new CacheItem(key, value, staleTime);
		expect(cache).toBeInstanceOf(CacheItem);
	});

	it('#hasSameKey', () => {
		const cache = new CacheItem(key, value, staleTime);
		expect(cache.hasSameKey(new Set(key))).toEqual(true);
	});
	it('key equality based on shallowEqual', () => {
		const key = { a: 1, b: 2, c: { a: 1, b: 2 } };
		const cacheA = new CacheItem({ ...key }, value, staleTime);
		const cacheB = new CacheItem({ ...key, c: { ...key.c } }, value, staleTime);
		expect(cacheA.hasSameKey(key)).toEqual(true);
		expect(cacheB.hasSameKey(key)).toEqual(false);
	});

	it('#getValue', () => {
		const staleTime = 1000;
		const cache = new CacheItem(key, value, staleTime);
		expect(cache.getValue()).toEqual({ index: 1 });
		expect(cache.getValue()).toBe(value);
	});

	it('#isOverFreshTime', () => {
		const staleTime = 1000;
		const cache = new CacheItem(key, value, staleTime);
		const originNow = now;

		now = originNow + staleTime - 1;
		expect(cache.isOverFreshTime()).toEqual(false);
		now = originNow + staleTime;
		expect(cache.isOverFreshTime()).toEqual(true);
		now = originNow;
	});
	it('#isOverFreshTime: staleTime === 0 always return true', () => {
		const cache = new CacheItem(key, value, 0);
		const originNow = now;

		now = originNow + staleTime - 1;
		expect(cache.isOverFreshTime()).toEqual(true);
		now = originNow + staleTime;
		expect(cache.isOverFreshTime()).toEqual(true);
		now = originNow;
	});
	it('#isOverFreshTime: when isStale is true always return true', () => {
		const cache = new CacheItem(key, value, 1000);
		const originNow = now;

		now = originNow + staleTime - 1;
		expect(cache.isOverFreshTime()).toEqual(false);
		cache.markStale();
		expect(cache.isOverFreshTime()).toEqual(true);
		now = originNow;
	});

	it('#markStale ', () => {
		const staleTime = 1000;
		const cache = new CacheItem(key, value, staleTime) as any;
		expect(cache.isStale).toEqual(false);
		cache.markStale();
		expect(cache.isStale).toEqual(true);
		expect(cache.isOverFreshTime()).toEqual(true);
	});

	it('#isOverCacheTime', () => {
		const staleTime = 1000;
		const cache = new CacheItem(key, value, staleTime) as any;
		const originNow = now;

		now = originNow + staleTime;
		expect(cache.isOverFreshTime()).toEqual(true);
		expect(cache.isOverCacheTime(2000)).toEqual(false);

		now = originNow + staleTime + 2000;
		expect(cache.isOverFreshTime()).toEqual(true);
		expect(cache.isOverCacheTime(2000)).toEqual(true);
		now = originNow;
	});
	it('#isOverCacheTime: isStale does not have effect on isOverCacheTime', () => {
		const cache = new CacheItem(key, value, staleTime);
		cache.markStale();
		expect(cache.isOverCacheTime(0)).toEqual(false);
	});
});
