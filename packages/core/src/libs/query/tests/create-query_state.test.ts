import { createQuery } from '../create-query';

describe('createQuery state setting', () => {
	const error = new Error('error');
	const retryCount = 3;

	it('createQuery happy case', async () => {
		jest.useFakeTimers();
		const query = createQuery({
			query() {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve({ initiated: true });
					}, 3000);
				});
			},
			initData: { initiated: false },
		});
		const initState = query();
		expect(initState).toEqual({
			data: { initiated: false },
			isFetching: false,
			isLoading: false,
			isRefetching: false,
			error: null,
			dataDeps: undefined,
			initiated: false,
		});
		query.fetchQuery();
		const fetchingState = query();
		expect(fetchingState).toEqual({
			data: { initiated: false },
			isFetching: true,
			isLoading: true,
			isRefetching: false,
			error: null,
			dataDeps: undefined,
			initiated: true,
		});
		const subscription = query.subscribe(() => {
			const completedState = query();
			expect(completedState).toEqual({
				data: { initiated: true },
				isFetching: false,
				isLoading: false,
				isRefetching: false,
				error: null,
				dataDeps: undefined,
				initiated: true,
			});
			subscription();
		});
		jest.runAllTimers();
	});

	it('createQuery error case', async () => {
		jest.useFakeTimers();
		const retrySpy = jest.fn();
		const query = createQuery({
			query() {
				return new Promise((resolve, reject) => {
					retrySpy();
					setTimeout(() => {
						reject(error);
					}, 3000);
				});
			},
			retryCount, // another 3 attempts
			retryInterval: 3000, // 3s
			initData: { initiated: false },
		});
		const initState = query();
		expect(initState).toEqual({
			data: { initiated: false },
			isFetching: false,
			isLoading: false,
			isRefetching: false,
			error: null,
			dataDeps: undefined,
			initiated: false,
		});
		query.fetchQuery();
		const fetchingState = query();
		expect(fetchingState).toEqual({
			data: { initiated: false },
			isFetching: true,
			isLoading: true,
			isRefetching: false,
			error: null,
			dataDeps: undefined,
			initiated: true,
		});
		const subscription = query.subscribe(() => {
			const completedState = query();
			expect(completedState).toEqual({
				data: { initiated: false },
				isFetching: false,
				isLoading: false,
				isRefetching: false,
				error,
				dataDeps: undefined,
				initiated: true,
			});
			expect(retrySpy).toHaveBeenCalledTimes(retryCount + 1);
			subscription();
		});
		jest.runAllTimers();
	});

	it('createQuery error would be removed as soon as another fetch call is made, not after api are set.', (done) => {
		jest.useFakeTimers();
		const error = new Error('what the');
		const query = createQuery({
			query(showError: boolean) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						if (showError) {
							reject(error);
						} else {
							resolve({ num: 1 });
						}
					}, 3000);
				});
			},
			initData: { num: 0 },
		});
		const stack: any[] = [];
		query.subscribe((state) => {
			stack.push(state);
			const last = stack.length - 1;
			switch (last) {
				case 0: // skip
					break;
				case 1:
					expect(stack[last]).toEqual(expect.objectContaining({ error }));
					query.fetchQuery(false);
					jest.runAllTimers();
					break;
				case 2:
					expect(stack[last]).toEqual(expect.objectContaining({ error: null }));
					done();
					break;
			}
		});
		query.fetchQuery(true);
		jest.runAllTimers();
	});

	it('createQuery always save the latest request even latest one arrive before previous one', (done) => {
		jest.useFakeTimers();
		const query = createQuery({
			query({ n, time }: { n: number; time: number }) {
				return new Promise((resolve) => {
					setTimeout(() => {
						resolve({ n, time });
					}, time);
				});
			},
			initData: { n: -1, time: 0 },
		});

		const stateRecord: Array<any> = [];
		const queryIds: string[] = [];
		query.subscribe((state) => {
			stateRecord.push(state);
			const nth = stateRecord.length - 1;
			switch (nth) {
				case 0:
					expect(stateRecord[nth]).toEqual(expect.objectContaining({ lastDeps: { n: 1, time: 3000 } }));
					break;
				case 1:
					expect(stateRecord[nth]).toEqual(
						expect.objectContaining({
							lastDeps: { n: 2, time: 1000 },
						})
					);
					jest.advanceTimersByTime(3000);
					break;
				case 2:
					expect(stateRecord[nth]).toEqual(
						expect.objectContaining({
							dataDeps: { n: 2, time: 1000 },
							lastDeps: { n: 2, time: 1000 },
						})
					);
					queryIds.forEach((id) => {
						expect(query.isActiveQuery(id)).toBeFalsy();
					});
					done();
					break;
			}
		});
		queryIds.push(query.fetchQuery({ n: 1, time: 3000 }));
		queryIds.push(query.fetchQuery({ n: 2, time: 1000 }));
		jest.advanceTimersByTime(1100);
	});
});
