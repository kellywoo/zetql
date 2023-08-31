import { CacheDB } from '../cache-db';
import { CacheGroup } from '../cache-group';

describe('cacheDB', () => {
	it('#getSafe: if cacheDB does not have cachegroup for the key, it creates one', () => {
		const cacheDB = new CacheDB({}) as any;
		const cacheGroup1 = cacheDB.getSafe(1);
		expect(cacheGroup1).toBeInstanceOf(CacheGroup);
		const cacheGroup2 = cacheDB.getSafe(1);
		expect(cacheGroup1).toBe(cacheGroup2);
	});

	it('#get vs getSafe', () => {
		const cacheDB = new CacheDB({}) as any;
		expect(cacheDB.get('1')).toBe(undefined);
		cacheDB.getSafe('1');
		expect(cacheDB.get('1')).not.toBe(undefined);
	});

	it('#clear works', () => {
		const manager = new CacheDB({});
		const first = manager.getSafe('1') as any;
		const second = manager.getSafe('2') as any;
		first.setCache('1', 1);
		first.setCache('2', 2);
		second.setCache('1', 1);
		second.setCache('2', 2);
		expect(first.cacheList.length).toBe(2);
		expect(second.cacheList.length).toBe(2);
		manager.clear();
		expect(first.cacheList.length).toBe(0);
		expect(second.cacheList.length).toBe(0);
	});
});
