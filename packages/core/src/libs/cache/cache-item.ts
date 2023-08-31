import { shallowEqual } from 'fast-equals';

export class CacheItem<T, K = any> {
	private expireAt = 0;
	private isStale = false;
	private readonly value: T;
	constructor(private cacheKey: K, value: T, staleTime: number) {
		if (staleTime !== 0) {
			const now = Date.now();
			this.expireAt = now + staleTime;
		}
		this.value = value && typeof value === 'object' ? Object.freeze(value) : value;
	}
	hasSameKey(cacheKey: any) {
		return shallowEqual(this.cacheKey, cacheKey);
	}
	getValue() {
		return this.value;
	}
	markStale() {
		this.isStale = true;
	}

	// expireAt === 0,
	// use cache but always consider it state adn update it to new query response
	isOverCacheTime(extraCacheTime: number) {
		if (this.expireAt === 0 || extraCacheTime === -1) {
			return false;
		} else {
			return this.expireAt + extraCacheTime <= Date.now();
		}
	}

	isOverFreshTime() {
		if (this.isStale) {
			return true;
		}
		if (this.expireAt === 0) {
			return true;
		} else {
			return this.expireAt <= Date.now();
		}
	}
}
