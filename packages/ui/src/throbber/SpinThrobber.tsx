import styled, { keyframes } from "styled-components";

const Width = 2;
const Height = 6;
const Duration = 1200;
const Count = 10;
const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;
const Container = styled.div`
	position: relative;
	margin-left: -${Width / 2}px;
	height: 70px;
	width: 0;
	overflow: visible;
`;
const spinning = keyframes`
   0% { background-color:#fff }
    100% { background-color:#808080 }
`;
const Segment = styled.span`
	display: block;
	position: absolute;
	height: ${Height}px;
	width: ${Width}px;
	background-color: rgba(234, 234, 234, 0.3);
	border-radius: 10px 10px 0 0;
	-webkit-transform-origin-y: 200%;
	animation-duration: 1200ms;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
	animation-name: ${spinning};
	${Array(Count)
		.fill(0)
		.map((_, i) => {
			return `&:nth-child(${i + 1}) {transform: rotate(${(360 / Count) * i}deg);
animation-delay: ${(i * Duration) / Count}ms;}`;
		})}
`;
export const SpinThrobber = ({ className }: { className?: string }) => {
	return (
		<Wrapper className={className}>
			<Container>
				{Array(Count)
					.fill(0)
					.map((_, i) => {
						return <Segment key={i.toString()} />;
					})}
			</Container>
		</Wrapper>
	);
};
