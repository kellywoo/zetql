import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import { ButtonBase } from '@ui/buttons';
import { classnames } from '@ui/helpers';

const BOX_ACTIVE_STYLE = `
  cursor: pointer;
  width: 100%;
  position: relative;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	padding: 0 0 0 0;
	font-size: 14px;
	height: 42px;
`;

const PAD_LEFT = 16;
const STYLES = {
  MenuTree: styled.dl`
    letter-spacing: 1px;
  `,
  MenuStandalone: styled.div`
    ${BOX_ACTIVE_STYLE}
  `,
  MenuTreeHead: styled.dt`
    ${BOX_ACTIVE_STYLE};
  `,
  MenuTreeContent: styled.dd`
    &.is-hide {
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
      opacity: 0;
      background-color: transparent;
      color: transparent;
      background-image: none;
    }
  `,
  ActionButton: styled(ButtonBase)`
    display: flex;
    flex-direction: row;
    cursor: inherit;
    font-size: 14px;
    font-weight: inherit;
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    letter-spacing: 1px;
    flex: auto;
    padding-right: 10px;
    &.is-toggle-button {
      padding-right: 50px;
    }
    &.is-open .toggle-icon {
      transform: rotate(0deg);
    }
    .toggle-icon {
      position: absolute;
      right: 16px;
      top: 11px;
      transform: rotate(-90deg);
      transition: transform 0.3s;
    }
  `,
  Item: styled.li`
    border-radius: 8px;
    & + & {
      margin-top: 10px;
    }
  `,
  ToggleIcon: styled(ButtonBase)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: flex-end;
    padding-right: 32px;
    color: #ddd;
    .is-closed {
      transform: rotate(-90deg);
    }
  `,
};

export type AppMenuObject = {
  label: string;
  children?: Array<AppMenuObject>;
  info?: any;
  icon: ReactNode;
  pathname: string;
};

const DownArrow = () => {
  return (
    <svg
      width={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={'toggle-icon'}
    >
      <path
        d="M10 12.229C9.90268 12.229 9.80901 12.2083 9.71901 12.167C9.62835 12.125 9.53468 12.0623 9.43801 11.979L5.77101 8.312C5.63168 8.17333 5.56201 8.01366 5.56201 7.833C5.56201 7.65233 5.63168 7.49266 5.77101 7.354C5.90968 7.21533 6.06235 7.146 6.22901 7.146C6.39568 7.146 6.54868 7.21533 6.68801 7.354L10 10.667L13.312 7.354C13.4513 7.21533 13.6077 7.146 13.781 7.146C13.955 7.146 14.1113 7.21533 14.25 7.354C14.3887 7.49266 14.458 7.649 14.458 7.823C14.458 7.99633 14.3887 8.15266 14.25 8.292L10.562 11.979C10.4927 12.0483 10.406 12.1073 10.302 12.156C10.198 12.2047 10.0973 12.229 10 12.229Z"
        fill="currentColor"
      />
    </svg>
  );
};
type AddActiveClassFn = (
  route: AppMenuObject,
  pathname: string
) => string | undefined | void;
const MenuItem = ({
  item,
  depth,
  navigate,
  pathname,
  isChild,
  addRouteClass,
}: {
  item: AppMenuObject;
  depth: number;
  navigate: (item: AppMenuObject, routeClassName: string) => void;
  pathname: string;
  isChild?: boolean;
  addRouteClass?: AddActiveClassFn;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const routeClassName = addRouteClass?.(item, pathname) || '';
  if (!item.children?.length) {
    return (
      <STYLES.MenuStandalone
        as={isChild ? 'li' : 'div'}
        className={routeClassName}
      >
        <STYLES.ActionButton
          style={{ paddingLeft: `${depth * PAD_LEFT}px` }}
          onClick={() => {
            navigate(item, routeClassName);
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </STYLES.ActionButton>
      </STYLES.MenuStandalone>
    );
  }
  return (
    <STYLES.MenuTree>
      <STYLES.MenuTreeHead className={routeClassName}>
        <STYLES.ActionButton
          className={classnames('is-toggle-button', isOpen && 'is-open')}
          style={{ paddingLeft: `${depth * PAD_LEFT}px` }}
          onClick={() => {
            setIsOpen((b) => !b);
          }}
        >
          {item.icon}
          <span>{item.label}</span>
          <DownArrow />
        </STYLES.ActionButton>
      </STYLES.MenuTreeHead>
      <STYLES.MenuTreeContent className={isOpen ? undefined : 'is-hide'}>
        <ul>
          {item.children.map((child) => {
            return (
              <MenuItem
                key={child.pathname}
                navigate={navigate}
                item={child}
                depth={depth + 1}
                pathname={pathname}
                addRouteClass={addRouteClass}
                isChild
              />
            );
          })}
        </ul>
      </STYLES.MenuTreeContent>
    </STYLES.MenuTree>
  );
};

const APP_MENU_STYLE = {
  AppNav: styled.nav<{ folded?: boolean }>`
    display: flex;
    flex-direction: column;
    .is-icon {
      font-size: 16px;
    }
  `,
  AppNavTitle: styled.h4`
    font-size: 12px;
    font-weight: 400;
    line-height: 130%;
    color: rgb(187, 187, 187);
    padding: 12px ${PAD_LEFT}px 20px;
  `,
  AppNavList: styled.ul``,
};
export const AppGnb = ({
  menu,
  addRouteClass,
  className,
  navigate,
  pathname: originPathname,
}: {
  menu: Array<AppMenuObject>;
  addRouteClass?: AddActiveClassFn;
  className?: string;
  navigate: (item: AppMenuObject, routeClassName: string) => void;
  pathname: string;
}) => {
  const pathname = `/` + originPathname.replace(/(^\/)|(\/$)/g, '');
  return (
    <APP_MENU_STYLE.AppNav className={className}>
      <APP_MENU_STYLE.AppNavTitle>Menu</APP_MENU_STYLE.AppNavTitle>
      <APP_MENU_STYLE.AppNavList>
        {menu.map((item) => {
          return (
            <STYLES.Item title={item.label} key={item.label}>
              <MenuItem
                addRouteClass={addRouteClass}
                depth={1}
                navigate={navigate}
                item={item}
                pathname={pathname}
              />
            </STYLES.Item>
          );
        })}
      </APP_MENU_STYLE.AppNavList>
    </APP_MENU_STYLE.AppNav>
  );
};
