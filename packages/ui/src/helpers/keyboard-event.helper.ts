import { KeyboardEvent as ReactKeyboardEvent } from 'react'

export const KeyboardKeys = {
	arrowRight: 'arrowright',
	arrowLeft: 'arrowleft',
	arrowUp: 'arrowup',
	arrowDown: 'arrowdown',
	enter: 'enter',
	backspace: 'backspace',
	delete: 'delete',
	escape: 'escape',
	space: ' ',
	tab: 'tab',
} as const
export type KeyboardKeys = TypeOfValue<typeof KeyboardKeys>
export const ArrowDirection = {
	left: 'left',
	right: 'right',
	down: 'down',
	up: 'up'
} as const
export type ArrowDirection = TypeOfValue<typeof ArrowDirection>
export class KeyboardEventHelper {
	isSingleKey(e: KeyboardEvent | ReactKeyboardEvent<HTMLElement>) {
		return !e.altKey && !e.metaKey && !e.ctrlKey
	}
	getKeyName(e: KeyboardEvent | ReactKeyboardEvent<HTMLElement>) {
		return e.key ? e.key.toLowerCase() : ''
	}
	isEnter(e: KeyboardEvent | ReactKeyboardEvent<HTMLElement>) {
		return this.isSingleKey(e) && e.key.toLowerCase() === KeyboardKeys.enter
	}
	isEsc(e: KeyboardEvent | ReactKeyboardEvent<HTMLElement>) {
		return this.isSingleKey(e) && e.key.toLowerCase() === KeyboardKeys.escape
	}
	isBackspace(e: KeyboardEvent | ReactKeyboardEvent<HTMLElement>) {
		return this.isSingleKey(e) && e.key.toLowerCase() === KeyboardKeys.backspace
	}
	isDelete(e: KeyboardEvent | ReactKeyboardEvent<HTMLElement>) {
		return this.isSingleKey(e) && e.key.toLowerCase() === KeyboardKeys.delete
	}
	arrowDirection(e: KeyboardEvent | ReactKeyboardEvent<HTMLElement>): ArrowDirection | '' {
		if (!this.isSingleKey(e)) {
			return ''
		}
		const match = e.key.toLowerCase().match(/arrow(left|right|down|up)/)
		if (!match) {
			return ''
		}
		return match[1] as ArrowDirection || ''
	}
	hasDoubleKey(e: KeyboardEvent | ReactKeyboardEvent<HTMLElement>) {
		return e.altKey || e.ctrlKey || e.metaKey
	}
	isKeyOf(e: KeyboardEvent | ReactKeyboardEvent<HTMLElement>, key: KeyboardKeys | KeyboardKeys[]) {
		const eKey = e.key?.toLowerCase()
		return Array.isArray(key) ? key.some((k) => k === eKey) : eKey === key
	}
}
export const keyboardEventHelper = new KeyboardEventHelper()
