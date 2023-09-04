import styled from 'styled-components';
import { PropsWithChildren, ReactNode } from 'react';
import { ButtonBase } from '@ui/buttons';
import { modalControlSubject } from '@/subjects/modal/modalControl.subject.ts';

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
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const AppGutter = styled.div`
  max-width: 1200px;
  min-width: 780px;
  margin: 0 auto;
  padding: 0 1rem;
`;
const Main = styled.main`
  flex: auto;
  min-height: 0;
  &.is-scrollable {
    overflow-y: auto;
  }
`;
const HeaderNav = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const HeaderLink = styled.div``;

const MenuPanelButton = styled(ButtonBase)`
  width: 40px;
  height: 40px;
  position: relative;
  margin-right: 6px;
  left: -6px;
  flex: none;
`;
const MenuIcon = styled.span`
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 60%;
    height: 2px;
    left: 20%;
    display: block;
    background-color: #121212;
  }

  &::before {
    top: 35%;
  }
  &::after {
    top: 65%;
  }
`;

const GithubIcon = ({ width }: { width: string }) => {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" version="1.1" width={width}>
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
    </svg>
  );
};

const IconButton = styled(ButtonBase)`
  width: 40px;
  height: 40px;
`;

export const AppLayout = ({
  header,
  children,
  scrollable,
}: PropsWithChildren<{ header?: ReactNode; scrollable?: boolean }>) => {
  const setIsOpen = modalControlSubject((state) => {
    return state.setShowGnbMenu;
  });
  return (
    <Wrapper>
      <Header>
        <HeaderGutter>
          <MenuPanelButton onClick={() => setIsOpen(true)}>
            <MenuIcon />
          </MenuPanelButton>
          <HeaderNav>{header}</HeaderNav>
          <HeaderLink>
            <IconButton
              title={'zetql'}
              as={'a'}
              href={'https://github.com/zetql/zetql'}
              target={'_blank'}
              rel={'noopener noreferrer'}
            >
              <GithubIcon width={'28px'} />
            </IconButton>
          </HeaderLink>
        </HeaderGutter>
      </Header>
      <Main className={scrollable ? 'is-scrollable' : undefined}>
        {children}
      </Main>
    </Wrapper>
  );
};
