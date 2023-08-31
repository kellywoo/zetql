import { TypeOfValue } from '@zetql/react';

export const CouponType = {
	amount: 'amount',
	rate: 'rate',
} as const;

export type CouponType = TypeOfValue<typeof CouponType>;

// NOTE: 쿠폰 대상이 option메뉴별로인지 product별로인지 개개 아이템별로인지 전체 금액에 대한것인지 알기 어려움.
// 디자인 가이드에 따로 항목으로 들어가 있는것으로 보아 전체금액에 대한 것으로 인지하고 작업
export interface CouponModel {
	id: string;
	type: CouponType;
	name: string;
	price: number;
}
