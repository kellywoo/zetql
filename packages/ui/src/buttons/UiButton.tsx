import styled from 'styled-components';
import { classnames } from '@ui/helpers/classnames.ts';
import { SquareButton } from '@ui/buttons/SquareButton.tsx';
import {
	AppColor,
	BlueColor,
	GrayColor,
	GreenColor,
	RedColor,
} from '@ui/style';

interface ButtonAttr {
	fillType?: 'filled' | 'line' | 'grayline' | 'ghost' | 'cute';
	fillColor?: 'primary' | 'green' | 'sky' | 'blue' | 'default' | 'red';
	block?: boolean;
}
export const UiButton = styled(SquareButton)
	.withConfig({
		shouldForwardProp: (prop) => !['fillType', 'fillColor'].includes(prop),
	})
	.attrs<ButtonAttr>(({ fillColor, fillType }) => {
		return {
			type: 'button',
			className: classnames(
				`is-${fillType || 'filled'}`,
				`is-${fillColor || 'primary'}`
			),
		};
	})<ButtonAttr>`
	min-width: 60px;
	&.is-filled {
		color: #fff;
		background-color: var(--rgb-main);
		border-color: var(--rgb-main);
	}
	&.is-lined {
		color: var(--rgb-main);
		background-color: rgba(255, 255, 255, 0.8);
		border-color: var(--rgb-main);
	}
	&.is-grayline {
		color: var(--rgb-main);
		background-color: rgba(255, 255, 255, 0.8);
		border-color: var(--color-gray300);
	}
	&.is-cute {
		color: rgba(var(--rgb-main), 1);
		background-color: rgba(var(--rgb-main), 0.1);
		border-color: transparent;
	}
	&.is-ghost {
		color: rgba(var(--rgb-main), 1);
		background-color: transparent;
		border-color: transparent;
	}
	&.is-primary {
		--rgb-main: ${GrayColor.gray200};
	}
	&.is-green {
		--rgb-main: ${GreenColor.green300};
	}
	&.is-red {
		--rgb-main: ${RedColor.red600};
	}
	&.is-sky {
		--rgb-main: ${BlueColor.blue800};
	}
	&.is-blue {
		--rgb-main: ${BlueColor.blue400};
	}
	&.is-default {
		--rgb-main: ${GrayColor.gray400};
	}
`;
