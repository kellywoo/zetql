import { BoundSubject, createSelector } from "./internalCore.ts";
import { useEffect, useState } from 'react';

export const createUseSelector = <T extends Array<BoundSubject<any>>, S>(
	...args: Parameters<typeof createSelector>
) => {
	const { subscribe, getValue } = createSelector(...args);
	return function useSelector() {
		const [value, setValue] = useState(getValue());
		useEffect(() => {
			return subscribe((state) => setValue(state));
		}, []);
		return value;
	};
};
