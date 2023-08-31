let id = 0;
class UniqueId {
	key: string;
	num = 0;
	constructor() {
		this.key = Date.now().toString(36) + ++id;
	}
	generate() {
		return `${this.key}${++this.num}`;
	}
}
export function uniqueId() {
	const generator = new UniqueId();
	return () => generator.generate();
}
