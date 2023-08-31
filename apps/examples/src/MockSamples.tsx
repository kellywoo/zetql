import React from 'react';
import { useEffect } from 'react';
import { fetchClient } from '@/utils/fetchClient';

const MockSamples = () => {
	useEffect(() => {
		fetchClient('/categories').then(console.log);
		fetchClient('/products').then(console.log);
		fetchClient('/coupons').then(console.log);
		// fetchClient('/stocks?cursor=1&size=20').then(console.log);
	}, []);
	return null;
};

export default MockSamples;
