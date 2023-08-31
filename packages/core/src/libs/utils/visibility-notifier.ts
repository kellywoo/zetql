type State = {
	span: number;
	value: boolean;
};
type Fn = (b: State) => void;
export class VisibilityNotifier {
	private value: State = {
		span: 0,
		value: this.isClient() ? window.navigator.onLine : true,
	};
	private hiddenAt = 0;
	private visibleAt = 0;
	private listeners = new Set<Fn>();
	isClient() {
		return typeof window !== 'undefined';
	}
	constructor() {
		if (this.isClient()) {
			document.addEventListener('visibilitychange', () => {
				const status = this.getVisibility();
				const now = Date.now();
				let data: State;
				if (status === 'hidden') {
					this.hiddenAt = now;
					data = { span: now - this.visibleAt, value: false };
				} else {
					this.visibleAt = now;
					data = { span: now - this.hiddenAt, value: true };
				}
				this.listeners.forEach((fn) => fn(data));
			});
		}
	}
	private getVisibility() {
		return this.isClient() ? document.visibilityState : 'visible';
	}
	getValue() {
		return this.value;
	}
	subscribe(fn: Fn) {
		this.listeners.add(fn);
		return () => {
			this.listeners.delete(fn);
		};
	}
}
export const visibilityNotifier = new VisibilityNotifier();
