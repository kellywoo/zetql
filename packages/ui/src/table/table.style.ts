import styled from 'styled-components';

interface ClassNameProp {
	className?: string;
}
export const TableClassNames = {
	table: 'is-table',
	empty: 'is-empty',
	thead: 'is-thead',
	tbody: 'is-tbody',
	th: 'is-th-cell',
	td: 'is-td-cell',
	tr: 'is-row',
	attachment: 'is-attachment',
};

export const TableStyle = {
	Table: styled.div.attrs<ClassNameProp>(() => {
		return { className: TableClassNames.table };
	})<ClassNameProp>`
		width: 100%;
	`,
	Thead: styled.div.attrs<ClassNameProp>(() => {
		return { className: TableClassNames.thead };
	})<ClassNameProp>`
		width: 100%;
		display: flex;
		z-index: 2;
	`,
	Th: styled.div.attrs<ClassNameProp>(() => {
		return { className: TableClassNames.th };
	})<ClassNameProp>`
		min-width: 0;
		flex: 1 1 auto;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	`,
	Tbody: styled.div.attrs<ClassNameProp>(() => {
		return { className: TableClassNames.tbody };
	})<ClassNameProp>`
		width: 100%;
	`,
	Tr: styled.div.attrs<ClassNameProp>(() => {
		return { className: TableClassNames.tr };
	})<ClassNameProp>`
		width: 100%;
		display: flex;
		align-items: center;
		&.is-clickable {
			cursor: pointer;
		}
	`,
	Attachment: styled.div.attrs<ClassNameProp>(() => {
		return { className: TableClassNames.attachment };
	})<ClassNameProp>`
		.${TableClassNames.tr} {
			border-bottom: none;
		}
		border-bottom: 1px solid var(--color-border);
	`,
	Td: styled.div.attrs<ClassNameProp>(() => {
		return { className: TableClassNames.td };
	})<ClassNameProp>`
		min-width: 0;
		flex: 1 1 auto;
		width: 100px;
	`,
	Empty: styled.div.attrs<ClassNameProp>(() => {
		return { className: TableClassNames.empty };
	})<ClassNameProp>`
		min-height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: default;
	`,
};
