import { useStateRef } from '@ui/hooks/useStateRef';
import { SetStatePayload, TypeOfValue } from "@ui/type.ts";

export const TableSortLabel = { desc: 'desc', asc: 'asc' } as const;
export type TableSortLabel = TypeOfValue<typeof TableSortLabel>;
export type TableSortData = { key: string; order: TableSortLabel };

export interface UiTableState {
	sortData: TableSortData;
	query: string;
	selectFilters: Map<string, string>;
	selectedSet: Set<string>;
}

const TABLE_STATE_INIT: UiTableState = {
	sortData: { key: '', order: 'desc' },
	query: '',
	selectFilters: new Map(),
	selectedSet: new Set(),
};

export type UiTableSetState = (fn: SetStatePayload<UiTableState>, b?: boolean) => void;
export const useTableState = () => {
	const { state, setState, getState, setMutation } = useStateRef<UiTableState>(() => {
		return {
			...TABLE_STATE_INIT,
		};
	});

	return { getTableState: getState, setTableState: setState, mutateTableState: setMutation, tableState: state };
};
