import { useCallback, useRef, useState } from 'react'
import { SetStatePayload } from "@ui/type.ts";

type SetState<T, P> = (fn: SetStatePayload<T>) => P;
type GetState<T> = () => T;
export function useStateRef<T>(
	initState: T | (() => T),
	syncFn?: (s: T) => void,
): { state: T; setState: SetState<T, void>; setMutation: SetState<T, T>; getState: () => T } {
	const stateRef = useRef<T>(initState as T)
	if (typeof stateRef.current === 'function' && stateRef.current === initState) {
		stateRef.current = stateRef.current()
	}
	const syncFnRef = useRef(syncFn)
	syncFnRef.current = syncFn
	const [_, trigger] = useState(0)
	const setState: (fn: SetStatePayload<T>, skip?: boolean) => void = useCallback(function (fn: SetStatePayload<T>, skipTrigger?: boolean) {
		const origin = stateRef.current
		const state = typeof fn === 'function' ? (fn as (s:T) => T)(origin) : fn
		const keys = Object.keys(state) as Array<keyof T>
		if (keys.some((key) => state[key] !== origin[key])) {
			if (typeof origin === 'object' && origin && !Array.isArray(origin)) {
				stateRef.current = { ...origin, ...state }
			} else {
				stateRef.current = state as T
			}
			if (typeof syncFnRef.current === 'function') {
				syncFnRef.current(stateRef.current)
			}
			if (!skipTrigger) {
				trigger((n) => n + 1)
			}
		}
	}, [])
	const setMutation = useCallback((fn: SetStatePayload<T>) => {
		setState(fn, true)
		return stateRef.current
	}, [])
	const getState: GetState<T> = useCallback(() => {
		return stateRef.current
	}, [])
	return { state: stateRef.current, setState, setMutation, getState }
}
