import { BoundSubject } from "./internalCore.ts";
import { useEffect, useRef } from 'react';

export const useSubjectSubscribe = <S>(subject: BoundSubject<S>, subscribe: (s: S) => void) => {
	const callBackRef = useRef({
		subscribe,
	});
	callBackRef.current = {
		subscribe,
	};
	useEffect(() => {
		const subscription = subject.subscribe((data) => {
			callBackRef.current.subscribe(data);
		});
		return () => {
			subscription();
		};
	}, []);
};
