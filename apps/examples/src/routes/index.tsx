import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { lazy, PropsWithChildren, ReactNode, Suspense, useEffect } from 'react';
import { StockPage } from '@/routes/stock/StockPage.tsx';
import { FullPageThrobber } from '@ui/throbber';
import { AppGround } from '@/routes/layout/AppGround.tsx';

const OrderContent = lazy(() => import('@/routes/order/OrderPage.tsx'));
const StockRelativeCursor = lazy(
  () => import('@/routes/stock/mains/RelativeCursor.tsx')
);
const StockStaticCursor = lazy(
  () => import('@/routes/stock/mains/StaticCursor.tsx')
);

const SuspenseLoading = ({ children }: PropsWithChildren<unknown>) => {
  return <Suspense fallback={<FullPageThrobber />}>{children}</Suspense>;
};
const OrderPage = () => {
  return (
    <SuspenseLoading>
      <OrderContent />
      <Outlet />
    </SuspenseLoading>
  );
};
const RelativeCursorPage = () => {
  return (
    <SuspenseLoading>
      <StockRelativeCursor />
    </SuspenseLoading>
  );
};
const StaticCursorPage = () => {
  return (
    <SuspenseLoading>
      <StockStaticCursor />
    </SuspenseLoading>
  );
};

const Redirect = ({ url }: { url: string }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(url, { replace: true });
  }, [url]);
  return null;
};

export type AppRoutObject = Omit<RouteObject, 'children'> & {
  label?: string;
  icon?: ReactNode;
  children?: AppRoutObject[];
};

const ToAppMain = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const pathname = search.get('pathname');
  const navigate = useNavigate();
  // pathname이 있는 경우 appground 내부에서 처리
  useEffect(() => {
    if (!pathname) {
      navigate('/stock', { replace: true });
    }
  }, [pathname]);
  return null;
};
export const AppNavMenu: AppRoutObject[] = [
  {
    path: '/',
    Component: AppGround,
    children: [
      {
        path: 'stock',
        label: 'Stock List',
        Component: StockPage,
        children: [
          {
            path: 'static',
            label: 'Static Cursor',
            Component: StaticCursorPage,
          },
          {
            path: 'relative',
            label: 'Relative Cursor',
            Component: RelativeCursorPage,
          },
          {
            path: '*',
            element: <Redirect url={'/stock/static'} />,
          },
          {
            index: true,
            element: <Redirect url={'/stock/static'} />,
          },
        ],
      },
      {
        path: 'order',
        label: 'Order Cart',
        Component: OrderPage,
        children: [
          {
            path: '*',
            element: <Redirect url={'/order'} />,
          },
        ],
      },
      {
        path: '*',
        Component: ToAppMain,
      },
      {
        index: true,
        Component: ToAppMain,
      },
    ],
  },
];

export const appRouter = createBrowserRouter(AppNavMenu as RouteObject[]);
