import { useEffect } from 'react';
import styled from 'styled-components';
import { AppColor } from '@ui/style/AppColor.ts';

const CategoryMenu = styled.button`
	color: ${AppColor.softGrayText};
	padding: 0.75rem 1.5rem;
	user-select: none;
	font-weight: 600;
	text-transform: uppercase;
	height: 4.5rem;
	&.is-active {
		color: #0b0b0b;
	}
`;

const Wrapper = styled.nav`
	flex: auto;
	min-width: 0;
`;

export interface Menu {
	id: string;
	name: string;
}
export const AppMenuNav = ({
	menu,
	activeMenu,
	setActive,
}: {
	menu: Array<Menu>;
	activeMenu: string;
	setActive: (s: string) => void;
}) => {
	useEffect(() => {
		if (menu.length && !menu.find(({ id }) => id === activeMenu)) {
			setActive(menu[0].id || '');
		}
	}, [activeMenu, menu]);
	return (
		<Wrapper>
			{menu.map((c: Menu) => {
				return (
					<CategoryMenu
						key={c.id}
						className={activeMenu === c.id ? 'is-active' : undefined}
						onClick={() => {
							setActive(c.id);
						}}
					>
						{c.name}
					</CategoryMenu>
				);
			})}
		</Wrapper>
	);
};
