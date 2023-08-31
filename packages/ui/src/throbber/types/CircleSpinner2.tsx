import styled, { keyframes } from 'styled-components';

const animation = keyframes`

  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
export const CircleSpinner2 = styled.div`
	font-size: 10px;
	margin: 50px auto;
	text-indent: -9999em;
	width: 6rem;
	height: 6rem;
	border-radius: 50%;
	background: linear-gradient(to right, var(--throbber-color) 10%, rgba(255, 255, 255, 0) 42%);
	position: relative;
	animation: ${animation} 1.4s infinite linear;
	transform: translateZ(0);
	&:before {
		width: 50%;
		height: 50%;
		background: var(--throbber-color);
		border-radius: 100% 0 0 0;
		position: absolute;
		top: 0;
		left: 0;
		content: '';
	}
	&:after {
		background: var(--throbber-bg-color);
		width: 75%;
		height: 75%;
		border-radius: 50%;
		content: '';
		margin: auto;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
`;
