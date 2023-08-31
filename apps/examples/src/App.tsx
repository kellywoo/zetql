import MockSamples from '@/MockSamples';
import { ToastContainer } from 'react-toastify';
import { AppColor } from '@ui/style/AppColor';
import styled from 'styled-components';
import { ErrorBoundary } from '@ui/error/ErrorBoundary';
import { RouterProvider } from 'react-router-dom';
import { appRouter } from '@/appRouter.tsx';
import { AppBaseStyle } from '@ui/style';
import { AppStyle } from '@/components/style/App.style.ts';

export const StyledToastContainer = styled(ToastContainer).attrs({
	className: 'app-toast-container',
	toastClassName: 'app-toast-item',
	bodyClassName: 'app-toast-body',
})`
	&&& {
		--toastify-toast-min-height: 50px;
		padding-bottom: 60px;
		.app-toast-item {
			border: 1px solid ${AppColor.border};
			border-radius: 6px;
			color: ${AppColor.defaultText};
			font-size: 15px;
			line-height: 18px;
			align-items: start;
		}
	}
`;

function App() {
	return (
		<>
			<ErrorBoundary>
				<AppBaseStyle />
				<AppStyle />
				<StyledToastContainer />
				<RouterProvider router={appRouter} />
				<MockSamples />
			</ErrorBoundary>
		</>
	);
}

export default App;
