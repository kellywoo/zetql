import { AppLayout } from '@/routes/layout/AppLayout.tsx';
import { AppMenuNav } from '@/routes/layout/AppMenuNav.tsx';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const StockPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menu] = useState(() => {
    return [
      { id: 'static', name: 'Static Cursor Params' },
      { id: 'relative', name: 'Relatice Cursor Params' },
    ];
  });
  const activeMenu =
    location.pathname.replace(/\/$/, '').split('/').at(-1) || '';
  const setActiveMenu = (id: string) => {
    navigate(id);
  };
  return (
    <AppLayout
      scrollable
      header={
        <AppMenuNav
          menu={menu}
          activeMenu={activeMenu}
          setActive={setActiveMenu}
        />
      }
    >
      <Outlet />
    </AppLayout>
  );
};
