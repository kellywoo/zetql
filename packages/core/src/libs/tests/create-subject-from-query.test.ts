import { createQuery } from '../query/create-query';
import { createSubjectFromQuery } from '../create-subject-from-query';

describe('createStateFromQuery', () => {
	const prepareState = () => {
		const query = createQuery({
			query: ({ price, amount }: { price: number; amount: number }) => {
				return new Promise<{ price: number; amount: number; total: number }>((resolve) => {
					setTimeout(() => {
						resolve({ price, amount, total: price * amount });
					}, 3000);
				});
			},
			initData: { price: 0, amount: 0, total: 0 },
		});
		return { query, querySubject: createSubjectFromQuery(query) };
	};

	it('subscribe queryData', (done) => {
		jest.useFakeTimers();
		const { query, querySubject } = prepareState();

		const unsub = querySubject.init((current, next) => {
			return next;
		});
		querySubject.subscribe((state) => {
			expect(state).toEqual({ price: 100, amount: 3, total: 300 });
			unsub();
			done();
		});
		query.fetchQuery({ price: 100, amount: 3 });
		jest.runAllTimers();
	});

	it('can mutate & sync localData', (done) => {
		jest.useFakeTimers();
		const { query, querySubject } = prepareState();

		const unsub = querySubject.init((current, next) => {
			return next;
		});
		const results: any[] = [];
		querySubject.subscribe((state) => {
			results.push(state);
			const last = results.length - 1;
			switch (last) {
				case 0:
					expect(results[last]).toEqual({ price: 100, amount: 3, total: 300 });
					querySubject.setState({ price: 1000, amount: 3, total: 3000 });
					break;
				case 1:
					expect(results[last]).toEqual({
						price: 1000,
						amount: 3,
						total: 3000,
					});
					expect(querySubject.isSynced()).toEqual(false);
					querySubject.sync();
					break;
				case 2:
					expect(results[last]).toEqual({ price: 100, amount: 3, total: 300 });
					expect(querySubject.isSynced()).toEqual(true);
					query.fetchQuery({ price: 200, amount: 5 });
					jest.runAllTimers();
					break;
				case 3:
					expect(results[last]).toEqual({ price: 200, amount: 5, total: 1000 });
					expect(querySubject.isSynced()).toEqual(true);
					unsub();
					done();
			}
		});
		query.fetchQuery({ price: 100, amount: 3 });
		jest.runAllTimers();
	});
});
