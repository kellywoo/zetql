import styled from "styled-components";

export const PlusIcon = styled.span`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	&::after {
		content: '';
		display: block;
		width: 50%;
		height: 1px;
		background-color: currentColor;
	}
	&::before {
		content: '';
		display: block;
		position: absolute;
		width: 50%;
		height: 1px;
		background-color: currentColor;
		transform: rotate(-90deg);
	}
`;
