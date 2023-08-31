import styled from 'styled-components';
import { OrderItemCard } from '@/components/orderCart/OrderItemCard';
import { OrderCartSubject } from '@/subjects/orderCart/orderCart.subject.ts';
import { AppColor } from '@ui/style/AppColor';
import { CartItemModel } from '@/models/CartItem.model';
import { CouponModel } from '@/models/Coupon.model';
import { OrderItemCoupon } from '@/components/orderCart/OrderItemCoupon';

const ItemList = styled.ul`
	width: 100%;
	min-height: 90%;
	flex-wrap: wrap;
	gap: 20px;
`;
const ItemCard = styled.li`
	background-color: #fff;
	overflow: hidden;
	& + & {
		border-top: 1px solid ${AppColor.grayBg};
	}
`;

const EmptyList = styled.div`
	padding-top: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
`;
export const OrderItemList = ({
	optionVariantItems,
	totalOrderPrice,
	coupon,
	increase,
	decrease,
	remove,
}: {
	optionVariantItems: Array<CartItemModel>;
	coupon: CouponModel | null;
	totalOrderPrice: number;
} & Pick<OrderCartSubject, 'increase' | 'decrease' | 'remove'>) => {
	return (
		<>
			{optionVariantItems.length ? (
				<ItemList>
					{optionVariantItems.map(({ product, variantList }) => {
						return variantList.map((variant, i) => {
							return (
								<ItemCard key={product.productId + i}>
									<OrderItemCard
										item={variant}
										product={product}
										increase={increase}
										decrease={decrease}
										remove={remove}
									/>
								</ItemCard>
							);
						});
					})}
					{coupon && (
						<ItemCard>
							<OrderItemCoupon coupon={coupon} totalPrice={totalOrderPrice} />
						</ItemCard>
					)}
				</ItemList>
			) : (
				<EmptyList>담긴 상품이 없습니다.</EmptyList>
			)}
		</>
	);
};
