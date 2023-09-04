import ReactModal from 'react-modal';
import styled from 'styled-components';
import {
  ComponentPropsWithRef,
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ButtonBase } from '@ui/buttons/SquareButton.tsx';
import { CloseIcon } from '@ui/icons/CloseIcon.tsx';
import { CssTransition } from '@ui/transition/CssTransition.tsx';
import { useEscClose } from '@ui/hooks/useEscClose.ts';

const AsideModalOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(100, 100, 100, 0.2);
  overflow: hidden;

  &.is-entering {
    transition: opacity 0.3s;
    opacity: 0.2;
    will-change: opacity;
  }
  &.is-entered {
    transition: opacity 0.3s;
    opacity: 1;
  }
  &.is-leaving {
    opacity: 0;
    transition: opacity 0.3s;
    will-change: opacity;
  }
`;

const AsideRightSideMain = styled.div`
  position: absolute;
  width: 42rem;
  max-width: 100%;
  height: 100%;
  bottom: 0;
  right: 0;
  outline: none;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  tab-index: -1;
  --webkit-overflow-scrolling: touch;
  box-shadow: -2px 0 400px rgba(0, 0, 0, 0.3);

  &.is-entering {
    transition: transform 0.3s;
    transform: translateX(100%);
    will-change: transform, opacity;
  }
  &.is-entered {
    transition: transform 0.3s;
    transform: translateX(0);
  }
  &.is-leaving {
    transition: transform 0.3s;
    transform: translateX(100%);
    will-change: transform, opacity;
  }
`;
const AsideLeftSideMain = styled.div`
  position: absolute;
  width: 42rem;
  max-width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  outline: none;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  tab-index: -1;
  --webkit-overflow-scrolling: touch;
  box-shadow: -2px 0 400px rgba(0, 0, 0, 0.3);

  &.is-entering {
    transition: transform 0.3s;
    transform: translateX(-100%);
    will-change: transform, opacity;
  }
  &.is-entered {
    transition: transform 0.3s;
    transform: translateX(0);
  }
  &.is-leaving {
    transition: transform 0.3s;
    transform: translateX(-100%);
    will-change: transform, opacity;
  }
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
`;

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
  position: relative;
`;

export const HeaderWrapper = styled.div`
  font-size: 1.4rem;
  padding: 5rem 3rem 0;
  height: 7.5rem;
`;
export const AsideModalStyle = {
  Header: ({ title }: { title: string }) => {
    return (
      <HeaderWrapper>
        <h2>{title}</h2>
      </HeaderWrapper>
    );
  },
  Container: styled.div`
    min-height: calc(100% - 20rem);
    padding: 0 3rem;
  `,
  Footer: styled.div`
    position: sticky;
    bottom: 0;
    background-color: #fff;
    padding: 0.5rem 3rem 2rem;
  `,
};
export const AsideModal = ({
  isOpen,
  side,
  onRequestClose,
  showCloseButton,
  children,
  contentStyle,
  closeWithEscKey,
}: PropsWithChildren<{
  isOpen: boolean;
  side?: 'left' | 'right';
  onRequestClose: () => void;
  showCloseButton?: boolean;
  contentStyle?: CSSProperties;
  closeWithEscKey?: boolean;
}>) => {
  const appRootRef = useRef<HTMLElement | undefined>(undefined);
  if (!appRootRef.current) {
    appRootRef.current = document.getElementById('root') || undefined;
  }
  const [delayedOpen, setDelayedOpen] = useState(isOpen);
  const AsideMain = side === 'left' ? AsideLeftSideMain : AsideRightSideMain;

  const onClose = onRequestClose;
  useEscClose(isOpen, onRequestClose, closeWithEscKey);
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
  const overlayElement = (
    props: ComponentPropsWithRef<'div'>,
    contentElement: ReactNode
  ) => (
    <CssTransition animateTs={300} isOpen={isOpen}>
      <AsideModalOverlay {...props} style={undefined}>
        {contentElement}
      </AsideModalOverlay>
    </CssTransition>
  );
  const contentElement = (
    props: ComponentPropsWithRef<'div'>,
    children: ReactNode
  ) => {
    return (
      <CssTransition animateTs={300} isOpen={isOpen}>
        <AsideMain {...props} style={contentStyle}>
          {children}
        </AsideMain>
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
