import { useEffect, useRef, useState } from 'react';
import { RelativeThrobber } from '@ui/throbber';

export const ListFetcher = ({
	hasNext,
	fetch,
	recheckDeps,
	isFetching,
	root,
}: {
	fetch: () => void;
	hasNext: boolean;
	recheckDeps?: any;
	isFetching: boolean;
	root?: HTMLElement | null;
}) => {
	const fetchRef = useRef(fetch);
	const [el, setEl] = useState<HTMLElement | null>(null);

	useEffect(() => {
		if (el && hasNext && !isFetching) {
			const observer = new IntersectionObserver(
				(
					entries: IntersectionObserverEntry[],
					observer: IntersectionObserver
				) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							fetchRef.current?.();
						}
					});
				},
				{ root, rootMargin: '-40px 0px' }
			);
			observer.observe(el);
			return () => {
				observer.disconnect();
			};
		}
	}, [el, hasNext, isFetching, recheckDeps]);
	if (hasNext) {
		return (
			<div ref={setEl}>
				<RelativeThrobber />
			</div>
		);
	}
	return null;
};
