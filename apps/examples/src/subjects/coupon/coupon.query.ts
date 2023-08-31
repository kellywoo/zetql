import { fetchClient } from '@/utils/fetchClient';
import { CouponModel } from '@/models/Coupon.model';
import { createQuery } from '@zetql/react';

interface CouponListState {
	coupons: Array<CouponModel>;
}
const fetchCoupons: () => Promise<CouponListState> = () => {
	return fetchClient('/coupons')
		.then(({ data }) => {
			return { coupons: data };
		})
		.catch((e) => {
			throw e;
		});
};
export const couponQuery = createQuery<CouponListState, void>({
	query: fetchCoupons,
	initData: { coupons: [] },
});
