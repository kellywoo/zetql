import { Component, ErrorInfo } from 'react';
import styled from 'styled-components';
import { ErrorPage } from '@ui/error/ErrorPage.tsx';

export class ErrorBoundary extends Component<any, { hasError: boolean }> {
	constructor(props: any) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<ErrorPage
					buttons={[
						{
							label: 'refresh',
							onClick: () => {
								window.location.reload();
							},
						},
					]}
				/>
			);
		}

		return this.props.children;
	}
}
