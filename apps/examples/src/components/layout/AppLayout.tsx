import styled from 'styled-components';
import { PropsWithChildren, ReactNode } from 'react';

const Wrapper = styled.div`
	position: fixed;
	inset: 0;
	background-color: #f8f8f8;
	display: flex;
	flex-direction: column;
`;
const Header = styled.header`
	height: 6.7rem;
	flex: none;
	padding: 1rem 0;
	border-bottom: 2px solid #fff;
`;
const HeaderGutter = styled.div`
	padding: 0 1rem;
	max-width: 1200px;
	min-width: 780px;
	display: flex;
	justify-content: center;
	margin: 0 auto;
`;
export const AppGutter = styled.div`
	max-width: 1200px;
	min-width: 780px;
	margin: 0 auto;
`;
const Main = styled.main`
	flex: auto;
	min-height: 0;
	&.is-scrollable {
		overflow-y: auto;
	}
`;
export const AppLayout = ({
	header,
	children,
	scrollable,
}: PropsWithChildren<{ header?: ReactNode; scrollable?: boolean }>) => {
	return (
		<Wrapper>
			<Header>
				<HeaderGutter>{header}</HeaderGutter>
			</Header>
			<Main className={scrollable ? 'is-scrollable' : undefined}>
				{children}
			</Main>
		</Wrapper>
	);
};
