import { keyboardEventHelper } from './keyboard-event.helper.ts'

export class EscHelper {
	private stackCallback: Array<{ key: string; fn: () => void }> = []
	private i = 0
	constructor() {
		if (typeof window !== 'undefined') {
			document.addEventListener('keydown', (e) => {
				if (keyboardEventHelper.isEsc(e)) {
					const closeLayer = this.stackCallback[this.stackCallback.length - 1]
					closeLayer?.fn()
				}
			})
		}
	}
	register(fn: () => void) {
		const key = `esc_helper_no_${this.i++}`
		this.stackCallback.push({ key, fn })
		return () => {
			this.stackCallback = this.stackCallback.filter((item) => {
				return key !== item.key
			})
		}
	}
	update(key: string, fn: () => void) {
		this.stackCallback = this.stackCallback.map((item) => {
			return key !== item.key ? item : { key, fn }
		})
	}
}
export const escHelper = new EscHelper()
