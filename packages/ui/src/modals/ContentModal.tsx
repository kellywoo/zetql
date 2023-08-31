import ReactModal from 'react-modal';
import styled from 'styled-components';
import React, {
	ComponentPropsWithRef,
	CSSProperties,
	PropsWithChildren,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from 'react';
import { CssTransition } from '@ui/transition/CssTransition.tsx';
import { CloseIcon } from '@ui/icons/CloseIcon.tsx';
import { ButtonBase } from '@ui/buttons/SquareButton.tsx';
import { useEscClose } from '@ui/hooks/useEscClose.ts';

const ContentModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(100, 100, 100, 0.2);

	&.is-entering {
		transition: opacity 0.2s;
		opacity: 0.1;
		will-change: opacity;
	}
	&.is-entered {
		transition: opacity 0.2s;
		opacity: 1;
	}
	&.is-leaving {
		opacity: 0;
		transition: opacity 0.3s;
		will-change: opacity;
	}
`;
const ContentModalMain = styled.div`
	position: relative;
	width: 46rem;
	max-width: 100%;
	max-height: 100%;
	box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.2);
	background-color: #fff;
	transform: translateY(0);

	&.is-entering {
		transition: transform 0.5s;
		transform: translateY(70px);
		will-change: transform;
	}
	&.is-entered {
		transform: translateY(0);
	}
`;

const Content = styled.div`
	position: relative;
	overflow-y: auto;
`;

const CloseButton = styled(ButtonBase)`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 5rem;
	height: 5rem;
	background-color: transparent;
	color: #333;
	top: 0.5rem;
	right: 1rem;
	border-radius: 0;
	z-index: 1;
`;

export const ContentModal = ({
	isOpen,
	onRequestClose,
	showCloseButton,
	contentStyle,
	closeWithEscKey,
	children,
}: PropsWithChildren<{
	isOpen: boolean;
	onRequestClose: () => void;
	showCloseButton?: boolean;
	closeWithEscKey?: boolean;
	contentStyle?: CSSProperties;
}>) => {
	const appRootRef = useRef<HTMLElement | undefined>(undefined);
	if (!appRootRef.current) {
		appRootRef.current = document.getElementById('root') || undefined;
	}
	const [delayedOpen, setDelayedOpen] = useState(isOpen);

	const onClose = onRequestClose;
	useEscClose(isOpen, onClose, closeWithEscKey);
	useEffect(() => {
		if (isOpen) {
			setDelayedOpen(true);
		} else {
			const timer = setTimeout(() => {
				setDelayedOpen(false);
			}, 300);
			return () => {
				clearTimeout(timer);
			};
		}
	}, [isOpen]);
	const overlayElement = (props: ComponentPropsWithRef<'div'>, contentElement: ReactNode) => (
		<CssTransition animateTs={300} isOpen={isOpen}>
			<ContentModalOverlay {...props} style={undefined}>
				{contentElement}
			</ContentModalOverlay>
		</CssTransition>
	);
	const contentElement = (props: ComponentPropsWithRef<'div'>, children: ReactNode) => {
		return (
			<CssTransition animateTs={300} isOpen={isOpen}>
				<ContentModalMain {...props} style={contentStyle}>
					{children}
				</ContentModalMain>
			</CssTransition>
		);
	};

	return (
		<ReactModal
			isOpen={delayedOpen}
			onRequestClose={onClose}
			appElement={appRootRef.current}
			overlayElement={overlayElement}
			contentElement={contentElement}
		>
			<Content>{children}</Content>
			{showCloseButton && (
				<CloseButton aria-label={'close'} onClick={onClose}>
					<CloseIcon />
				</CloseButton>
			)}
		</ReactModal>
	);
};
