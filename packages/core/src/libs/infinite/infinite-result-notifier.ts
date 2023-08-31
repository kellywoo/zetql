import { InfiniteErrorListener, InfiniteSuccessListener } from './infinite.types.ts';

export class InfiniteResultNotifier<QData, Cursor> {
	private successSet = new Set<InfiniteSuccessListener<QData, Cursor>>();
	private errorSet = new Set<InfiniteErrorListener<Cursor>>();
	notifySuccess(data: { data: QData; cursor: Cursor }) {
		this.successSet.forEach((fn) => {
			fn(data);
		});
	}
	notifyError(data: { error: Error; cursor: Cursor }) {
		this.errorSet.forEach((fn) => {
			fn(data);
		});
	}
	subscribeData(fn: InfiniteSuccessListener<QData, Cursor>) {
		this.successSet.add(fn);
		return () => {
			return this.successSet.delete(fn);
		};
	}
	subscribeError(fn: InfiniteErrorListener<Cursor>) {
		this.errorSet.add(fn);
		return () => {
			return this.errorSet.delete(fn);
		};
	}
}
