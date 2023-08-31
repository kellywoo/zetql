import { createSubject } from '../create-subject';
import beverage, { Beverage } from './beverage.db';

describe('create-subject', () => {
	it('createSubject by generator', () => {
		const state = createSubject(() => beverage);
		expect(state()).toEqual(beverage);
	});
	it('createSubject by state', () => {
		const state = createSubject(beverage);
		expect(state()).toEqual(beverage);
	});
	it('#createSubject getter', () => {
		const state = createSubject(beverage);
		expect(state((s) => s.menu.extras)).toEqual(beverage.menu.extras);
		const getTop3 = (arr: Beverage[]) => {
			return arr.slice(0, 3);
		};
		const beverageTop3 = getTop3(beverage.menu.beverages);
		const mapped = state((s) => getTop3(s.menu.beverages));
		expect(mapped).toEqual(beverageTop3);
	});
	it('#createSubject getter: does not memoize. returning value is always newly generated', () => {
		const state = createSubject(beverage);
		expect(state((s) => s.menu.extras)).toEqual(beverage.menu.extras);
		const getTop3 = (arr: Beverage[]) => {
			return arr.slice(0, 3);
		};
		const mapped1 = state((s) => getTop3(s.menu.beverages));
		const mapped2 = state((s) => getTop3(s.menu.beverages));
		expect(mapped1).toEqual(mapped2);
		expect(mapped1).not.toBe(mapped2);
	});
	it('#createSubject setState', () => {
		const state = createSubject(beverage);
		const message = 'cafe open at 9:00';
		state.setState({ note: message });
		expect(state((s) => s.note)).toBe(message);
	});
	it('#createSubject setState keeps reference by shallow comparison', () => {
		const state = createSubject(beverage);
		const message = 'cafe open at 9:00';
		state.setState({ note: message });
		const currentState = state();
		state.setState({ note: message });
		expect(currentState).toBe(state());
	});
	it('#createSubject subscribe: with different reference', () => {
		const state = createSubject(beverage);
		const mockFn = jest.fn();
		const subscription = state.subscribe(mockFn);
		const message = 'cafe open at 9:00';
		state.setState({ note: message });
		expect(mockFn).toHaveBeenCalledTimes(1);
		// setstate with partial changes reference  even though partial is the same
		state.setState({ note: message });
		expect(mockFn).toHaveBeenCalledTimes(2);
		state.setState(state());
		expect(mockFn).toHaveBeenCalledTimes(2);
		state.setState({ note: 'another one' });
		expect(mockFn).toHaveBeenCalledTimes(3);
		subscription();
		state.setState({ note: 'after unsubscribe.. does not update' });
		expect(mockFn).toHaveBeenCalledTimes(3);
	});
});
