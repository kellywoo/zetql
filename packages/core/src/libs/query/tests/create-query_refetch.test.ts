import { createQuery } from '../create-query';

describe('createQuery: refetch', () => {
	it('refetch should force-call query even if the current cache is valid', (done) => {
		jest.useFakeTimers();
		const query = createQuery(
			{
				query() {
					return new Promise((resolve) => {
						setTimeout(() => {
							const {
								data: { number },
							} = query();
							resolve({ number: number + 1 });
						}, 2000);
					});
				},
				initData: { number: 0 },
			},
			{
				staleTime: 100000,
			}
		);
		const stack: any = [];
		let queryId: string;
		query.subscribeData((payload) => {
			stack.push(payload);
			const last = stack.length - 1;
			switch (last) {
				case 0:
					expect(query.isActiveQuery(queryId)).toBeFalsy();
					expect(stack[last]).toEqual(expect.objectContaining({ data: { number: 1 } }));
					queryId = query.refetchQuery();
					jest.advanceTimersByTime(3000);
					break;
				case 1:
					expect(query.isActiveQuery(queryId)).toBeFalsy();
					expect(stack[last]).toEqual(expect.objectContaining({ data: { number: 2 } }));
					done();
					break;
			}
		});
		queryId = query.fetchQuery();
		jest.advanceTimersByTime(3000);
	});
});
