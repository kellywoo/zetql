import styled from 'styled-components';

export const AdditionalOptionPrice = styled.span`
	&::before {
		content: '( + ';
	}
	&::after {
		content: ')';
		margin-left: 2px;
	}
`;
