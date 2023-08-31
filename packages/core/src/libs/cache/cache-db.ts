import { CacheGroup } from './cache-group.ts';
import { CacheGroupOption, CacheDBOptions } from '../types.ts';

export class CacheDB<State = any, K = any> {
	private cacheGroupMap: Map<string, CacheGroup<State, K>> = new Map();
	private readonly cacheGroupOption: CacheGroupOption;
	constructor({ staleTime, extraCacheTime }: CacheDBOptions = {}) {
		this.cacheGroupOption = {
			staleTime: Math.ceil(Math.max(staleTime || 0, 0)),
			extraCacheTime: extraCacheTime === -1 ? -1 : Math.ceil(Math.max(extraCacheTime || 0, 0)),
		};
	}
	get(cacheGroupKey: string) {
		return this.cacheGroupMap.get(cacheGroupKey);
	}
	clear(cacheKey?: string) {
		if (typeof cacheKey === 'string') {
			this.cacheGroupMap.get(cacheKey)?.clear();
		} else {
			[...this.cacheGroupMap.values()].forEach((cg) => cg.clear());
		}
	}
	getSafe(cacheGroupKey: string) {
		return this.cacheGroupMap.get(cacheGroupKey) || this.create(cacheGroupKey);
	}

	create(key: string) {
		const group = new CacheGroup<State, K>(key, this.cacheGroupOption);
		this.cacheGroupMap.set(key, group);
		return group;
	}
}

export const createCacheDB = <State, K=any>(cacheOptions?: CacheDBOptions) => {
	const cacheDB = new CacheDB<State, K>({
		staleTime: 5 * 60000,
		...cacheOptions,
	});
	return cacheDB;
};
