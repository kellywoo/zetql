import styled, { keyframes } from 'styled-components';
const animation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
export const CircleSpinner = styled.div`
  --throbber-bg-color:  rgba(0, 0, 0, 0.1);
  --throbber-color: rgba(0, 0, 0, 0.3);
	margin: 60px auto;
	font-size: 10px;
	position: relative;
	text-indent: -9999em;
	border-top: 1.1em solid var(--throbber-bg-color);
	border-right: 1.1em solid var(--throbber-bg-color);
	border-bottom: 1.1em solid var(--throbber-bg-color);
	border-left: 1.1em solid var(--throbber-color);
	transform: translateZ(0);
	animation: ${animation} 1.1s infinite linear;
	&,
	&:after {
		border-radius: 50%;
		width: 10em;
		height: 10em;
	}
`;
