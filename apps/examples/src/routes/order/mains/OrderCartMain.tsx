import { modalControlSubject } from '@/subjects/modal/modalControl.subject.ts';
import styled from 'styled-components';
import { orderCartState } from '@/subjects/orderCart/orderCart.subject.ts';
import { useMemo } from 'react';
import { OrderItemList } from '@/components/orderCart/OrderItemList.tsx';
import { LocaleNumber } from '@ui/formats/localeNumber.tsx';
import { AppColor } from '@ui/style/AppColor.ts';
import { useQueryFetch, useSubjectValue } from '@zetql/react';
import { testQuery } from '@/subjects/test/test.query.ts';

const Wrapper = styled.div`
	height: 100%;
	overflow-y: auto;
	position: relative;
`;

const Header = styled.h2`
	font-size: 1.4rem;
	padding: 2rem 0 0;
	position: sticky;
	height: 6rem;
	top: 0;
	background-color: #f8f8f8;
	z-index: 1;
`;
const Container = styled.div`
	min-height: calc(100% - 14rem);
	padding: 0;
`;
const Footer = styled.div`
	position: sticky;
	bottom: 0;
	padding: 0.5rem 0 2rem;
`;

const OrderButton = styled.button`
	height: 5.4rem;
	font-size: 1.7rem;
	background-color: #333;
	color: #fff;
	border-radius: 1.2rem;
	width: 100%;
	padding: 0 5rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: auto;
	&:disabled {
		background-color: ${AppColor.grayBg};
		cursor: default;
	}
`;
const CouponButton = styled(OrderButton)`
	flex: none;
	width: 10rem;
`;
const OrderAction = styled.div`
	display: flex;
	gap: 1rem;
`;

const OrderTotalPrice = styled(LocaleNumber)`
	margin-right: 1rem;
	letter-spacing: 2px;
`;
export const OrderCartMain = () => {
	const { itemsGroup, coupon, increase, decrease, remove, summarizeReceipt } = useSubjectValue(orderCartState);
	const { setOrderSummary, setShowCouponSelectModal } = useSubjectValue(modalControlSubject);
	useQueryFetch(testQuery, { deps: 1 });
	const { optionVariantItems, totalOrderPrice } = useMemo(() => {
		const optionVariantItems = [...itemsGroup.values()];
		let totalOrderPrice = 0;
		optionVariantItems.forEach(({ product, variantList }) => {
			variantList.forEach(({ options, quantity }) => {
				let basePrice = product.price;
				options.forEach((p) => {
					basePrice += product.optionChargeMap.get(p)?.price || 0;
				});
				totalOrderPrice += basePrice * quantity;
			});
		});
		return { optionVariantItems, totalOrderPrice };
	}, [itemsGroup]);
	return (
		<Wrapper>
			<Header>선택 상품</Header>
			<Container>
				<OrderItemList
					optionVariantItems={optionVariantItems}
					totalOrderPrice={totalOrderPrice}
					coupon={coupon}
					increase={increase}
					decrease={decrease}
					remove={remove}
				/>
			</Container>
			<Footer>
				<OrderAction>
					<CouponButton
						disabled={totalOrderPrice === 0}
						onClick={() => {
							setShowCouponSelectModal(true);
						}}
					>
						쿠픈
					</CouponButton>
					<OrderButton
						type={'button'}
						disabled={totalOrderPrice === 0}
						onClick={() => {
							const receipt = summarizeReceipt();
							setOrderSummary(receipt);
						}}
					>
						<OrderTotalPrice amount={totalOrderPrice} /> 결제
					</OrderButton>
				</OrderAction>
			</Footer>
		</Wrapper>
	);
};
