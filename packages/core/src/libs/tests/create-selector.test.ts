import { createSubject } from '../create-subject';
import { createSelector } from '../create-selector';

describe('createSelector', () => {
	const a = createSubject({ a: 'Kelly' });
	const b = createSubject({ b: 'has' });
	const c = createSubject({ c: 10 });
	const d = createSubject({ d: 'dollars' });

	// createSubject subscription only calls
	it('#getValue', () => {
		const selector = createSelector([a, b, c, d], (a, b, c, d) => {
			return `${a.a} ${b.b} ${c.c} ${d.d}.`;
		});
		expect(selector.getValue()).toEqual('Kelly has 10 dollars.');
	});

	it('#subscribe', () => {
		const selector = createSelector([a, b, c, d], (a, b, c, d) => {
			return `${a.a} ${b.b} ${c.c} ${d.d}.`;
		});
		const subscription = selector.subscribe((message) => {
			expect(message).toEqual('Kelly has 100 dollars.');
			subscription();
		});
		c.setState({ c: 100 });
	});

	it('#subscribe return memoized value by shallow compare', () => {
		const selector = createSelector([a, b, c, d], (a, b, c, d) => {
			return { a: a.a, b: b.b, c: c.c, d: d.d };
		});
		c.setState({ c: 1000 });
		const prev = selector.getValue();
		c.setState({ c: 1000 });
		const current = selector.getValue();
		expect(prev).toBe(current);
	});

	it('#subscribe return new value when compareFn return false', () => {
		const selector = createSelector(
			[a, b, c, d],
			(a, b, c, d) => {
				return { a: a.a, b: b.b, c: c, d: d.d };
			},
			(a, b) => false
		);
		c.setState({ c: 1000 });
		const prev = selector.getValue();
		c.setState({ c: 1000 });
		const current = selector.getValue();
		expect(prev).not.toBe(current);
	});
});
