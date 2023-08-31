import { CouponModel, CouponType } from '@/models/Coupon.model';
import styled from 'styled-components';
import { LocaleNumber } from '@ui/formats/localeNumber';
import { AppColor } from '@ui/style/AppColor';
import { applyCouponDiscount } from '@/helpers/applyCouponDiscount';

const OptionRow = styled.dl`
	display: flex;
	position: relative;
	padding: 2.5rem 1.5rem;

	> dt {
		flex: auto;
		min-width: 0;
		word-break: break-all;
		letter-spacing: 0.1px;
	}
	> dd {
		margin-left: 1rem;
		flex: none;
		color: ${AppColor.red};
	}
`;
const Name = styled.p`
	display: block;
`;
const Desc = styled.span`
	margin-left: 6px;
`;
export const OrderItemCoupon = ({ coupon, totalPrice }: { coupon: CouponModel; totalPrice: number }) => {
	const isAmountCoupon = coupon.type === CouponType.amount;
	const discount = applyCouponDiscount(totalPrice, coupon);
	return (
		<div>
			<OptionRow>
				<dt>
					<Name>
						{coupon.name}
						<Desc>
							{isAmountCoupon ? (
								<span>
									최대 <LocaleNumber amount={coupon.price} /> 할인
								</span>
							) : (
								<span>{coupon.price}%</span>
							)}
						</Desc>
					</Name>
				</dt>
				<dd>{<LocaleNumber amount={-1 * discount} />}</dd>
			</OptionRow>
		</div>
	);
};
