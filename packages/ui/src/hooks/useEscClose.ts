import { useEffect, useRef } from 'react';
import { escHelper } from '@ui/helpers/esc.helper';

export const useEscClose = (isOpen: boolean, requestClose: () => void, useEsc?: boolean) => {
	const ref = useRef({ requestClose, useEsc });
	ref.current = { requestClose, useEsc };
	useEffect(() => {
		if (isOpen) {
			return escHelper.register(() => {
				if (!ref.current.useEsc) {
					ref.current.requestClose();
				}
			});
		}
	}, [isOpen]);
};
