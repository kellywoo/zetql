import { OrderSummaryModel } from '@/models/OrderSummary.model';
import { createSubject } from '@zetql/react';
export const modalControlSubject = createSubject<{
	orderSummary: OrderSummaryModel | null;
	setOrderSummary: (s: OrderSummaryModel | null) => void;

	showCouponSelectModal: boolean;
	setShowCouponSelectModal: (b: boolean) => void;

	productDetailId: string | null;
	setProductDetailId: (s: string | null) => void;

	showOrderCart: boolean;
	setShowOrderCart: (s: boolean) => void;
}>((set) => ({
	orderSummary: null,
	setOrderSummary: (orderSummary) => {
		set({ orderSummary });
	},
	productDetailId: null,
	setProductDetailId: (id) => {
		set({ productDetailId: id });
	},
	showCouponSelectModal: false,
	setShowCouponSelectModal: (b: boolean) => {
		set({ showCouponSelectModal: b });
	},
	showOrderCart: false,
	setShowOrderCart: (b: boolean) => {
		set({ showOrderCart: b });
	},
}));
