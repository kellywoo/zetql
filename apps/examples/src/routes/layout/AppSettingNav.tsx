import styled from 'styled-components';
import { UiButton } from '@ui/buttons/UiButton.tsx';
import { modalControlSubject } from '@/subjects/modal/modalControl.subject.ts';
import { useSubjectValue } from '@zetql/react';

const Wrapper = styled.nav`
	flex: none;
	margin-left: 20px;
`;
export const AppSettingNav = () => {
	const setShowOrderCart = useSubjectValue(modalControlSubject, (s) => {
		return s.setShowOrderCart;
	});
	return (
		<Wrapper>
			<UiButton onClick={() => setShowOrderCart(true)}>CART</UiButton>
		</Wrapper>
	);
};
