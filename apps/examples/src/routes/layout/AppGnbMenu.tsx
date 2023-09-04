import { AsideModal } from '@ui/modals';
import styled from 'styled-components';
import { AppGnb, AppMenuObject } from '@/routes/layout/AppGnb.tsx';
import { useCallback, useMemo } from 'react';
import { AppNavMenu, AppRoutObject } from '@/routes';
import { useLocation, useNavigate } from 'react-router-dom';
import { modalControlSubject } from '@/subjects/modal/modalControl.subject.ts';
import { useSubjectValue } from '@zetql/react';

const AppMenuContent = styled.div`
  padding: 30px 0;
`;
const StyledAppGnb = styled(AppGnb)`
  .is-active-parent,
  .is-active {
    font-weight: 600;
    color: #277148;
  }
  .is-active {
    background-color: #f9f9fa;
    cursor: default;
  }
`;

export const AppGnbMenu = () => {
  const { isOpen, setIsOpen } = useSubjectValue(
    modalControlSubject,
    (state) => {
      return { isOpen: state.showGnbMenu, setIsOpen: state.setShowGnbMenu };
    }
  );
  const navigate = useNavigate();
  const location = useLocation();
  const menu: AppMenuObject[] = useMemo(() => {
    const transferToMenu = (p: AppRoutObject, url: string) => {
      if (!p.label || !p.path) {
        return null;
      }
      const { children, path, label, icon } = p;
      const segment = path.replace(/(^\/)|(\/$)/g, '');
      const copy: AppMenuObject = {
        label,
        icon,
        pathname: `${url}/${segment}`,
      };

      if (!children?.length) {
        return copy;
      }

      const newChild = children
        .map((child) => {
          return transferToMenu(child, copy.pathname);
        })
        .filter(Boolean) as AppMenuObject[];

      if (newChild.length) {
        copy.children = newChild;
      }
      return copy;
    };

    return AppNavMenu[0]
      .children!.map((item) => {
        return transferToMenu(item, '');
      })
      .filter(Boolean) as AppMenuObject[];
  }, []);

  const addRouteClass = useCallback(
    (route: AppMenuObject, pathname: string) => {
      if (pathname.startsWith(route.pathname) && route.children?.length) {
        return 'is-active-parent';
      }
      if (pathname === route.pathname) {
        return 'is-active';
      }
    },
    []
  );

  const navigateTo = useCallback(
    (item: AppMenuObject, routeClassName: string) => {
      if (routeClassName !== 'is-active') {
        navigate(item.pathname);
        setIsOpen(false);
      }
    },
    [location]
  );

  return (
    <AsideModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      side={'left'}
      showCloseButton
    >
      <AppMenuContent>
        <StyledAppGnb
          menu={menu}
          addRouteClass={addRouteClass}
          navigate={navigateTo}
          pathname={location.pathname}
        />
      </AppMenuContent>
    </AsideModal>
  );
};
