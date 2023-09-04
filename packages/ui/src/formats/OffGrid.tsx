import styled from 'styled-components';

export const OffGrid = styled.div`
	&&& {
		position: absolute;
		width: 0;
		height: 0;
		overflow: hidden;
		opacity: 0;
		background-color: transparent;
		color: transparent;
		background-image: none;
	}
`;
