import { uniqueId } from './uniqueId.ts';

export type NotifierSubscription<S> = (s: S) => void;

const idGenerator = uniqueId();
export class Notifier<S> {
	private handler: Array<{
		key: string;
		fn: NotifierSubscription<S>;
	}> = [];
	private onceSet = new Set<string>();
	constructor(private options: { log?: boolean; id?: string } = {}) {}
	next(s: S) {
		if (this.options.log) {
			console.log(`%c ::::${this.options.id || 'Notifier'} next::::`, 'color: yellow', s);
		}
		this.handler = this.handler.filter(({ key, fn }) => {
			fn(s);
			return !this.onceSet.has(key);
		});
		this.onceSet.clear();
	}
	subscribe(fn: NotifierSubscription<S>) {
		const key = idGenerator();
		this.handler.push({ key, fn });
		return () => {
			this.handler = this.handler.filter(({ key: id }) => id !== key);
		};
	}
}
