import styled from 'styled-components';
import { ButtonBase } from '@ui/buttons';
import { PropsWithChildren } from 'react';

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	height: 100%;
	width: 100%;
	> div {
		margin-top: 20px;
		max-width: 340px;
	}
`;
const Button = styled(ButtonBase)`
	height: 4.6rem;
	font-size: 1.7rem;
	background-color: #333;
	color: #fff;
	border-radius: 1.2rem;
	width: 100%;
	padding: 0 5rem;
	min-width: 12rem;
	display: inline-flex;
	align-items: center;
	justify-content: space-evenly;
`;
const DefaultErrorMessage = () => {
	return (
		<p>
			Something went wrong.
			<br />
			😱😱😱😱
		</p>
	);
};
export const ErrorPage = ({
	buttons,
	children,
}: PropsWithChildren<{ buttons: Array<{ onClick: () => void; label: string }> }>) => {
	return (
		<Wrapper>
			<div>
				{children || <DefaultErrorMessage />}
				{buttons.map(({ label, onClick }) => {
					return (
						<Button onClick={onClick} key={label}>
							{label}
						</Button>
					);
				})}
			</div>
		</Wrapper>
	);
};
