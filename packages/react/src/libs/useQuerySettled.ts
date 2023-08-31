import { BoundQuery, QueryDataListener, QueryErrorListener } from "./internalCore.ts";
import { useEffect, useRef } from 'react';

export const useQuerySettled = <State, Deps>(
	querySubject: BoundQuery<State, Deps>,
	{
		onSuccess,
		onError,
	}: {
		onSuccess: QueryDataListener<State, Deps>;
		onError: QueryErrorListener<Deps>;
	}
) => {
	const callBackRef = useRef({
		onSuccess,
		onError,
	});
	callBackRef.current = {
		onSuccess,
		onError,
	};
	useEffect(() => {
		const dataSubscription = querySubject.subscribeData((data) => {
			const { onSuccess } = callBackRef.current;
			onSuccess?.(data);
		});
		const errorSubscription = querySubject.subscribeError((error) => {
			const { onError } = callBackRef.current;
			onError?.(error);
		});
		return () => {
			dataSubscription();
			errorSubscription();
		};
	}, []);
};
