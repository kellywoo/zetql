import { createBrowserRouter, useNavigate } from 'react-router-dom';
import { OrderPage } from '@/pages/order/OrderPage.tsx';
import { useEffect } from 'react';
import { StockPage } from '@/pages/stock/StockPage.tsx';
import { RelativeCursor } from '@/pages/stock/mains/RelativeCursor.tsx';
import { StaticCursor } from '@/pages/stock/mains/StaticCursor.tsx';

const Redirect = ({ url }: { url: string }) => {
	const navigate = useNavigate();
	useEffect(() => {
		navigate(url, { replace: true });
	}, []);
	return null;
};
export const appRouter = createBrowserRouter([
	{
		path: '/stock',
		Component: StockPage,
		children: [
			{
				path: 'static',
				Component: StaticCursor,
			},
			{
				path: 'relative',
				Component: RelativeCursor,
			},
			{
				path: '*',
				element: <Redirect url={'/stock/static'} />,
			},
		],
	},
	{
		path: '/order',
		Component: OrderPage,
	},
	{
		path: '*',
		element: <Redirect url={'/stock'} />,
	},
]);
