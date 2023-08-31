type State = {
	span: number;
	value: boolean;
};
type Fn = (b: State) => void;
export class ReconnectNotifier {
	private value: State = {
		span: 0,
		value: this.isClient() ? window.navigator.onLine : true,
	};
	isClient() {
		return typeof window !== 'undefined';
	}
	listeners: Set<Fn> = new Set();
	constructor() {
		if (this.isClient()) {
			window.addEventListener('offline', () => {
				const newValue = { span: Date.now() - this.value.span, value: false };
				this.value = newValue;
				this.listeners.forEach((fn) => fn(newValue));
			});
			window.addEventListener('online', () => {
				const newValue = { span: Date.now() - this.value.span, value: true };
				this.value = newValue;
				this.listeners.forEach((fn) => fn(newValue));
			});
		}
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
export const reconnectNotifier = new ReconnectNotifier();
