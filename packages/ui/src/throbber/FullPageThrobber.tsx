import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { CircleSpinner2 } from "@ui/throbber/types/CircleSpinner2.tsx";

const SpinnerBox = styled.div`
	position: relative;
	height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
`;
export const RelativeThrobber = ({ className, style }: { className?: string; style?: CSSProperties }) => {
	return (
		<SpinnerBox className={className} style={style}>
			<CircleSpinner2 />
		</SpinnerBox>
	);
};

export const FullPageThrobber = styled(RelativeThrobber)`
	position: fixed;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
`;

export const AbsoluteThrobber = styled(RelativeThrobber)`
	position: absolute;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
`
