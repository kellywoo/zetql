import { CouponModel } from '@/models/Coupon.model';
export type OrderItemSummaryModel = {
	key: string;
	options: Array<{ name: string; price: number }>;
	initialPrice: number;
	optionCharge: number;
	productName: string;
	quantity: number;
};
export type OrderSummaryModel = {
	items: Array<OrderItemSummaryModel>;
	totalProductPrice: number;
	coupon: CouponModel | null;
	couponDiscount: number;
};
