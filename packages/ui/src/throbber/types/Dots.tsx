import styled, { keyframes } from "styled-components";

const beforeFrame = keyframes`
0% {
	box-shadow: 1.5em 0 0 -0.5em;
}
32% {
	box-shadow: 1.5em 0 0 0.2em;
}
60%, 100% {
	box-shadow: 1.5em 0 0 -0.5em;
}
`;

const currentFrame = keyframes`
0% {
	box-shadow: 3em 0 0 -0.5em;
}
32% {
	box-shadow: 3em 0 0 0.2em;
}
60%, 100% {
	box-shadow: 3em 0 0 -0.5em;
}
`;

const afterFrame = keyframes`
 0% {
box-shadow: 4.5em 0 0 -0.5em;
}
32% {
box-shadow: 4.5em 0 0 0.2em;
}
60%, 100% {
box-shadow: 4.5em 0 0 -0.5em;
}

`;
const Wrapper = styled.div`
	font-size: 10px;
	width: 5em;
	text-align: left;
	height: 2em;
	line-height: 2em;
	position: relative;
	margin: 0 auto;
	color: var(--throbber-color);
`;
export const Dot = styled.span`
	position: relative;
	display: block;
	top: 0.5em;
	left: -1em;
	width: 1em;
	height: 1em;
	border-radius: 0.5em;
	background-color: transparent;
	box-shadow: 3em 0 0 -0.5em currentColor;
	animation: ${currentFrame} 1.5s infinite linear;
	animation-delay: 0.25s;
	&::before,
	&::after {
		content: "";
		display: inline-block;
		position: absolute;
		top: 0;
		left: 0;
		width: inherit;
		height: inherit;
		border-radius: inherit;
		background-color: transparent;
	}
	&::before {
		box-shadow: 1.5em 0 0 -0.5em;
		animation: ${beforeFrame} 1.5s infinite linear;
		animation-delay: 0s;
	}
	&::after {
		box-shadow: 4.5em 0 0 -0.5em;
		animation: ${afterFrame} 1.5s infinite linear;
		animation-delay: 0.5s;
	}
`;

/**
 * @developing
 * */
export const Dots = ({ className }: { className?: string }) => {
	return (
		<Wrapper className={className}>
			<Dot />
		</Wrapper>
	);
};
