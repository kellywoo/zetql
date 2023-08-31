import { CacheDirection, CacheGroupOption } from "../types.ts";
import { CacheItem } from './cache-item.ts';

// staleTime 0 => always fetch process
// extraCacheTime -1 => do not expire cachetime, to set -1 to manage it manually

export class CacheGroup<T, K = any> {
	private cacheList: Array<CacheItem<T, K>> = []; // 시간 순서 대로
	private staleTime = 0;
	private extraCacheTime = 0;

	constructor(public readonly key: string, cacheOption: CacheGroupOption) {
		this.staleTime = cacheOption.staleTime || 0;
		this.extraCacheTime = cacheOption.extraCacheTime || 0;
	}
	cleanUpByCacheTime() {
		if (this.extraCacheTime === -1) {
			return;
		}
		this.cacheList = this.cacheList.filter(
			(cache: CacheItem<T, K>) => !cache.isOverCacheTime(this.extraCacheTime)
		);
	}
	findCacheIndex(cacheKey: any) {
		// search from later one
		const len = this.cacheList.length;
		for (let i = len - 1; i >= 0; i--) {
			if (this.cacheList[i].hasSameKey(cacheKey)) {
				return i;
			}
		}
		return -1;
	}
	findCache(fn: (cache: CacheItem<T, K>) => boolean) {
		const len = this.cacheList.length;
		for (let i = len - 1; i >= 0; i--) {
			if (fn(this.cacheList[i])) {
				return this.cacheList[i];
			}
		}
		return undefined;
	}
	updateCache(cacheKey: K, value: T) {
		const cacheRef = new CacheItem<T, K>(cacheKey, value, this.staleTime);
		const index = this.findCacheIndex(cacheKey);
		if (index !== -1) {
			this.cacheList[index] = cacheRef;
		}
	}
	setCache(
		cacheKey: K,
		value: T
	) {
		const cacheRef = new CacheItem<T, K>(cacheKey, value, this.staleTime);
		const index = this.findCacheIndex(cacheKey);
		if (index !== -1) {
			// remove previous one
			this.cacheList.splice(index, 1, cacheRef);
		} else {
			this.cacheList.push(cacheRef);
		}
	}

	appendCache(
		cacheKey: K,
		value: T,
		direction: CacheDirection = 'forwards'
	) {
		const cacheItem = new CacheItem<T, K>(cacheKey, value, this.staleTime);
		if (direction === 'forwards') {
			this.cacheList.push(cacheItem);
		} else {
			this.cacheList.unshift(cacheItem);
		}
	}
	getCache(cacheKey: any): CacheItem<T, K> | undefined {
		const index = this.findCacheIndex(cacheKey);
		return this.cacheList[index];
	}
	clear() {
		this.cacheList = [];
	}
	getValues() {
		return this.cacheList.map((cache) => cache.getValue());
	}
	getStaleValues() {
		return this.cacheList
			.filter((cache) => {
				return cache.isOverFreshTime();
			})
			.map((cache) => cache.getValue());
	}
	getAnyStale() {
		return !!this.cacheList.find((cache) => {
			return cache.isOverFreshTime();
		});
	}
	hasCache() {
		return this.cacheList.length > 0
	}
}
