import {
  TableSortLabel,
  UiTableSetState,
  UiTableState,
} from '@ui/table/useTableState.tsx';
import { ReactElement, ReactNode } from 'react';
import { SelectOption } from '@ui/type.ts';

export type CellHeadCreator = (
  tableState: UiTableState,
  setTableState: UiTableSetState,
  sort: TableSortLabel | ''
) => ReactElement | string | null;
export type CellBodyCreator<T> = (
  s: T,
  tableState: UiTableState,
  setTableState: UiTableSetState
) => ReactElement | string | null;
export type RowFilterFn<T> = (s: T) => boolean;
export type TableSearchQuery<T> = (
  item: T,
  q: string,
  tableState: UiTableState
) => boolean;
export type TableSortFn<T> = (t: TableSortLabel) => (a: T, b: T) => number;
export type TableGeneratorRow<T> = {
  key: string;
  title?: string;
  head: CellHeadCreator | string;
  body: CellBodyCreator<T>;
  width?: string;
  flex?: number;
  className?: string;
  sort?: TableSortFn<T>;
  query?: TableSearchQuery<T>;
  headSelect?: {
    options: Array<SelectOption<string>>;
    filter: TableSearchQuery<T>;
  };
};
export type TableGenerator<T> = Array<TableGeneratorRow<T>>;

export interface TableProp<T> {
  filter?: RowFilterFn<T>;
  items: T[];
  trackBy: ((s: T, i: number) => string) | keyof T;
  generator: TableGenerator<T>;
  className?: string;
  empty?: ReactNode;
  info?: any;
  onRowClick?: (s: T) => void;
  isLoading?: boolean;
  attachmentRender?: CellBodyCreator<T>;
  normalizeQuery?: (q: string) => string;
}

export type TableGroupProps<T> = TableProp<T> & {
  groupBy: TableProp<T>['trackBy'];
  groupSort?: (a: { groupId: string }, b: { groupId: string }) => number;
  groupTitleRenderer: (id: string) => ReactNode | null;
};
