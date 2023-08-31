import React, { memo, ReactElement, ReactNode, useMemo } from 'react';
import { classnames } from '@ui/helpers/classnames';
import { UiTableSetState, UiTableState, useTableState } from './useTableState';
import { RelativeThrobber } from '@ui/throbber';
import {
	CellHeadCreator,
	TableGenerator,
	TableGeneratorRow,
	TableGroupProps,
	TableProp,
	TableSearchQuery,
} from '@ui/table/table.type.ts';
import { TableClassNames, TableStyle } from '@ui/table/table.style.ts';

const getWidthStyle = (width?: number | string, flex?: number) => {
	return typeof width === 'string'
		? { width, flex: flex || 'none' }
		: flex
		? { flex: `${flex} ${flex} ${flex * 10}px` }
		: { flex: '1 1 10px' };
};
const HeadRowCreator = <T,>({
	generator,
	tableState,
	setTableState,
}: {
	generator: TableGenerator<T>;
	tableState: UiTableState;
	setTableState: UiTableSetState;
}) => {
	const { sortData } = tableState;
	return (
		<TableStyle.Tr>
			{generator.map(({ head, width, flex, sort, className, key, headSelect }) => {
				const headFn = getHeader<T>(head);
				return (
					<TableStyle.Th key={key} className={className} style={getWidthStyle(width, flex)}>
						{headFn(tableState, setTableState, key === sortData.key ? sortData.order : '')}
					</TableStyle.Th>
				);
			})}
		</TableStyle.Tr>
	);
};
const BodyRowCreator = <T,>({
	item,
	onRowClick,
	generator,
	tableState,
	setTableState,
	isSelected,
	attachmentRender,
}: {
	item: T;
	onRowClick?: (s: T) => void;
	generator: TableGenerator<T>;
	tableState: UiTableState;
	setTableState: UiTableSetState;
	isSelected: boolean;
	attachmentRender?: TableProp<T>['attachmentRender'];
}) => {
	const isClickable = Boolean(onRowClick);
	const row = (
		<TableStyle.Tr
			itemScope
			className={classnames(isClickable ? 'is-clickable' : '', isSelected ? 'is-selected' : '')}
			tabIndex={0}
			onClick={() => {
				onRowClick?.(item);
			}}
		>
			{generator.map(({ body, width, flex, className, key }) => {
				return (
					<TableStyle.Td key={key} itemProp={key} className={className} style={getWidthStyle(width, flex)}>
						{body(item, tableState, setTableState)}
					</TableStyle.Td>
				);
			})}
		</TableStyle.Tr>
	);
	if (attachmentRender) {
		return (
			<TableStyle.Attachment itemScope>
				{row}
				{attachmentRender(item, tableState, setTableState)}
			</TableStyle.Attachment>
		);
	}
	return row;
};

const EmptyRowCreator = ({ isLoading, empty }: { isLoading?: boolean; empty: ReactNode }) => {
	return <TableStyle.Empty>{isLoading ? <RelativeThrobber /> : empty || 'Nothing to Display'}</TableStyle.Empty>;
};

function getHeader<T>(head: TableGeneratorRow<T>['head']): CellHeadCreator {
	const type = typeof head;
	if (type === 'string') {
		return () => head as string;
	}
	if (type === 'function') {
		return head as CellHeadCreator;
	}
	return () => '';
}

const useNormalizeProps = <T,>(props: TableProp<T>) => {
	const { trackBy, generator } = props;
	const trackByFn = useMemo(() => {
		if (typeof trackBy === 'function') {
			return trackBy;
		}
		if (typeof trackBy === 'string') {
			return (item: T) => {
				return (item[trackBy as keyof T] || '').toString();
			};
		}
		return (item: T, i: number) => {
			return i.toString();
		};
	}, [trackBy]);
	const filterData = useMemo(() => {
		const filterData: {
			select: Map<string, TableSearchQuery<T>>;
			query: Map<string, TableSearchQuery<T>>;
		} = {
			select: new Map(),
			query: new Map(),
		};
		generator.forEach(({ key, headSelect, query }) => {
			if (headSelect) {
				filterData.select.set(key, headSelect.filter);
			}
			if (query) {
				filterData.query.set(key, query);
			}
		});
		return filterData;
	}, [generator]);
	return { trackByFn, filterData };
};

// eslint-disable-next-line react/display-name
export const TableList = memo(<T = any,>(props: TableProp<T>) => {
	const { filter, items, generator, className, attachmentRender, onRowClick, isLoading, empty, normalizeQuery } = props;

	const { tableState, setTableState } = useTableState();
	const { sortData, query: rq, selectFilters } = tableState;
	const query = normalizeQuery ? normalizeQuery(rq) : rq;
	const sortFn = generator.find(({ key }) => sortData.key === key)?.sort;
	const { filterData, trackByFn } = useNormalizeProps(props);

	const filtered = useMemo(() => {
		const filtered = items.filter((item) => {
			for (const [key, fn] of filterData.select) {
				const value = selectFilters.get(key);
				// console.log(value, fn)
				if (fn && value && !fn(item, value, tableState)) {
					return false;
				}
			}
			if (query) {
				let passed = false;
				for (const [key, fn] of filterData.query) {
					if (fn?.(item, query, tableState)) {
						passed = true;
						break;
					}
				}
				if (!passed) {
					return false;
				}
			}
			return filter ? filter(item) : true;
		});
		if (!sortFn) {
			return filtered;
		}
		return filtered.sort(sortFn(sortData.order));
	}, [filterData, items, tableState, filter, selectFilters]);
	return (
		<TableStyle.Table className={className}>
			<TableStyle.Thead className={TableClassNames.thead}>
				<HeadRowCreator generator={generator} tableState={tableState} setTableState={setTableState} />
			</TableStyle.Thead>
			<TableStyle.Tbody className={TableClassNames.tbody}>
				{!isLoading && filtered.length > 0 ? (
					filtered.map((item, i) => {
						const key = trackByFn(item, i);
						return (
							<BodyRowCreator
								item={item}
								key={key}
								isSelected={tableState.selectedSet.has(key)}
								generator={generator}
								onRowClick={onRowClick}
								tableState={tableState}
								setTableState={setTableState}
								attachmentRender={attachmentRender}
							/>
						);
					})
				) : (
					<EmptyRowCreator empty={empty} isLoading={isLoading} />
				)}
			</TableStyle.Tbody>
		</TableStyle.Table>
	);
}) as <T>(p: TableProp<T>) => ReactElement | null;
(TableList as any).displayName = 'TableList';

// eslint-disable-next-line react/display-name
export const GroupTableList = memo(<T extends { id: string } = any>(props: TableGroupProps<T>) => {
	const {
		filter,
		items,
		generator,
		groupBy,
		className,
		empty,
		attachmentRender,
		onRowClick,
		isLoading,
		normalizeQuery,
		groupSort,
		groupTitleRenderer,
	} = props;

	const { tableState, setTableState } = useTableState();
	const { sortData, query: rq, selectFilters } = tableState;
	const query = normalizeQuery ? normalizeQuery(rq) : rq;
	const sortFn = generator.find(({ key }) => sortData.key === key)?.sort;
	const { filterData, trackByFn } = useNormalizeProps(props);

	const groupByFn = useMemo(() => {
		if (typeof groupBy === 'function') {
			return groupBy;
		}
		if (typeof groupBy === 'string') {
			return (item: T) => {
				return (item[groupBy as keyof T] || '').toString();
			};
		}
		return (item: T, i: number) => {
			return i.toString();
		};
	}, [groupBy]);

	const filtered = useMemo(() => {
		const map: Record<string, T> = {};
		const group: Record<string, { groupId: string; ids: Array<string> }> = {};
		items.forEach((item, i) => {
			for (const [key, fn] of filterData.select) {
				const value = selectFilters.get(key);
				if (fn && value && !fn(item, value, tableState)) {
					return false;
				}
			}
			if (query) {
				let passed = false;
				for (const [key, fn] of filterData.query) {
					if (fn?.(item, query, tableState)) {
						passed = true;
						break;
					}
				}
				if (!passed) {
					return false;
				}
			}
			const passed = filter ? filter(item) : true;
			if (passed) {
				const key = trackByFn(item, i);
				const groupId = groupByFn(item, i);
				map[key] = item;
				if (!group[groupId]) {
					group[groupId] = { groupId, ids: [] };
				}
				group[groupId].ids.push(key);
			}
		});
		return { passedGroup: group, passedMap: map };
	}, [filterData, items, tableState, filter, trackByFn, groupByFn]);

	const groupedList = useMemo(() => {
		const list: Array<{ type: 'content' | 'title'; id: string }> = [];
		const { passedMap, passedGroup } = filtered;
		const groups = Object.values(passedGroup);
		if (groupSort) {
			groups.sort(groupSort);
		}
		groups.forEach(({ groupId, ids }) => {
			if (ids.length && ids.find((itemId) => !!passedMap[itemId])) {
				const sortedIds = sortFn ? ids.sort((a, b) => sortFn(sortData.order)(passedMap[a], passedMap[b])) : ids;
				list.push({ type: 'title', id: groupId });
				sortedIds.forEach((itemId) => {
					if (passedMap[itemId]) {
						list.push({ type: 'content', id: itemId });
					}
				});
			}
		});
		return list;
	}, [filtered, groupSort]);

	return (
		<TableStyle.Table className={className}>
			<TableStyle.Thead className={TableClassNames.thead}>
				<HeadRowCreator generator={generator} tableState={tableState} setTableState={setTableState} />
			</TableStyle.Thead>
			<TableStyle.Tbody className={TableClassNames.tbody}>
				{!isLoading && groupedList.length > 0 ? (
					groupedList.map((item, i) => {
						const { id: key, type } = item;
						if (type === 'title') {
							return groupTitleRenderer(key);
						}
						return (
							<BodyRowCreator
								item={filtered.passedMap[key]}
								key={'item::' + key}
								isSelected={tableState.selectedSet.has(key)}
								generator={generator}
								onRowClick={onRowClick}
								tableState={tableState}
								setTableState={setTableState}
								attachmentRender={attachmentRender}
							/>
						);
					})
				) : (
					<TableStyle.Empty>
						{isLoading ? <RelativeThrobber /> : <EmptyRowCreator empty={empty} isLoading={isLoading} />}
					</TableStyle.Empty>
				)}
			</TableStyle.Tbody>
		</TableStyle.Table>
	);
}) as <T>(p: TableGroupProps<T>) => ReactElement | null;
(GroupTableList as any).displayName = 'GroupTableList';
