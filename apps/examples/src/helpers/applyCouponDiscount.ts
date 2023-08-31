import { CouponModel, CouponType } from '@/models/Coupon.model';

export const applyCouponDiscount = (totalPrice: number, coupon?: CouponModel | null) => {
	if (!coupon) {
		return 0;
	}
	const isAmountCoupon = coupon.type === CouponType.amount;
	return isAmountCoupon ? Math.min(coupon.price, totalPrice) : Math.floor((totalPrice * coupon.price) / 100);

	// 할인 적용 시, 모든 값은 올림으로 처리해주세요. 마이너스 값이므로 내림
};
