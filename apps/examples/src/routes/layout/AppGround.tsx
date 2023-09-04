import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppGnbMenu } from '@/routes/layout/AppGnbMenu.tsx';
import { useEffect } from 'react';

export const AppGround = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.search) {
      const search = new URLSearchParams(location.search);
      const pathname = search.get('pathname');
      if (!pathname) return;
      const decoded = decodeURIComponent(pathname).replace(/^\//, '');
      search.delete('pathname');
      const qs = search.toString();
      navigate(`/${decoded}${qs ? `?${qs}` : ''}`, { replace: true });
    }
  }, [location.search]);
  return (
    <>
      <AppGnbMenu />
      <Outlet />
    </>
  );
};
