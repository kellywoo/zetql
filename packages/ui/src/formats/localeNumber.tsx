import { ReactNode } from 'react';
import styled from 'styled-components';

export const commaTransform = (num: number | string) => {
	try {
		return typeof num === 'number' ? num.toLocaleString() : Number(num).toLocaleString();
	} catch (e) {
		return '???';
	}
};

const Wrapper = styled.span`
	font-variant-numeric: tabular-nums;
`;
export const LocaleNumber = ({
	amount,
	className,
	unit,
	itemProp,
}: {
	amount: number | string;
	className?: string;
	unit?: ReactNode;
	itemProp?: string;
}) => {
	return (
		<Wrapper className={className} itemProp={itemProp}>
			{commaTransform(amount)}
			{unit ?? '원'}
		</Wrapper>
	);
};
