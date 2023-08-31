import styled from 'styled-components';
import { LocaleNumber } from '@ui/formats/localeNumber';
import { AppColor } from '@ui/style/AppColor';
import { CloseIcon } from '@ui/icons/CloseIcon';
import { modalControlSubject } from '@/subjects/modal/modalControl.subject.ts';
import { OrderSummaryModel } from '@/models/OrderSummary.model';
import { CouponType } from '@/models/Coupon.model';
import { useSubjectValue } from '@zetql/react';
import { ContentModal } from '@ui/modals/ContentModal.tsx';

const Header = styled.header`
	font-size: 1.8rem;
	padding: 3rem 2.5rem 1.5rem;
	margin-bottom: 1rem;
	position: sticky;
	top: 0;
	background-color: #fff;
	z-index: 1;
`;
const Title = styled.h2`
	margin-bottom: 2.5rem;
`;
const Container = styled.div`
	padding: 0 2.5rem 5rem;
	height: 70vh;
	max-height: 700px;
`;

const SummaryList = styled.ul`
	> li {
		padding: 1rem 0 1.5rem;
		& + li {
			border-top: 1px solid ${AppColor.softGrayBg};
		}
	}
`;
const OptionRow = styled.dl`
	display: flex;
	> dt {
		flex: auto;
		word-break: break-all;
		min-width: 0;
		letter-spacing: 0.1px;
		> span,
		a {
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			word-wrap: break-word;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}
	> dd {
		margin-left: 1rem;
		flex: none;
	}
`;
const DefaultOptionRow = styled(OptionRow)`
	font-size: 1.5rem;
	padding: 1rem 0;
	line-height: 2rem;
	> dt {
		font-size: 1.6rem;
		> a {
			cursor: pointer;
		}
	}
`;
const AddedOptionRow = styled(OptionRow)`
	padding: 0.5rem 0 0.5rem 2rem;
	> dt {
		font-size: 1.4rem;
		color: ${AppColor.softGrayText};
	}
	> dd {
		font-size: 1.3rem;
		color: ${AppColor.point};
	}
	&.is-base {
		> dd {
			color: #333;
		}
	}
`;
const PriceSummaryRow = styled(OptionRow)`
	padding-top: 0.5rem;
	margin-top: 0.5rem;
	> dt {
		font-weight: 700;
	}
	> dd {
		font-size: 1.7rem;
		font-weight: 700;
	}
`;
const CouponSummaryRow = styled(OptionRow)`
	padding: 1rem 1.2rem;
	margin: 1.5rem -1.2rem 1rem;
	background-color: ${AppColor.softGrayBg};
	border-radius: 3rem;
	color: ${AppColor.red};
	font-size: 1.4rem;
`;
const AmountSign = styled.b`
	width: 1.5rem;
	height: 1.5rem;
	display: inline-flex;
	vertical-align: text-bottom;
`;
const OrderSummaryContent = ({ summary, onClose }: { summary: OrderSummaryModel; onClose: () => void }) => {
	const { items, totalProductPrice, coupon, couponDiscount } = summary;
	return (
		<>
			<Header>
				<Title>주문내역</Title>
				<PriceSummaryRow>
					<dt>총 결제 금액</dt>
					<dd>
						<LocaleNumber amount={Math.max(totalProductPrice - couponDiscount, 0)} />
					</dd>
				</PriceSummaryRow>
			</Header>
			<Container>
				<SummaryList>
					{items.map((item) => {
						const price = item.initialPrice + item.optionCharge;
						return (
							<li key={item.key}>
								<DefaultOptionRow>
									<dt>{item.productName}</dt>
									<dd>
										<LocaleNumber amount={price} />
									</dd>
								</DefaultOptionRow>
								<AddedOptionRow>
									<dt>기본</dt>
									<dd>
										<LocaleNumber amount={item.initialPrice} />
									</dd>
								</AddedOptionRow>
								{item.options.map((option) => {
									return (
										<AddedOptionRow key={option.name}>
											<dt>+&nbsp;{option.name}</dt>
											<dd>
												<LocaleNumber amount={option.price} />
											</dd>
										</AddedOptionRow>
									);
								})}
								<PriceSummaryRow>
									<dt>
										<AmountSign>
											<CloseIcon />
										</AmountSign>
										&nbsp;{item.quantity}
									</dt>
									<dd>
										<LocaleNumber amount={price * item.quantity} />
									</dd>
								</PriceSummaryRow>
							</li>
						);
					})}

					{coupon && Boolean(couponDiscount) && (
						<li>
							<CouponSummaryRow>
								<dt>
									{coupon.name} ({coupon.type === CouponType.amount ? `최대 ${coupon.price}원` : `${coupon.price}%`})
								</dt>
								<dd>
									<LocaleNumber amount={-1 * couponDiscount} />
								</dd>
							</CouponSummaryRow>
						</li>
					)}
				</SummaryList>
			</Container>
		</>
	);
};
export const OrderSummaryModal = () => {
	const { orderSummary, setOrderSummary } = useSubjectValue(modalControlSubject);

	const onClose = () => {
		setOrderSummary(null);
	};
	return (
		<ContentModal isOpen={!!orderSummary} onRequestClose={onClose} showCloseButton>
			{orderSummary ? <OrderSummaryContent summary={orderSummary} onClose={onClose} /> : null}
		</ContentModal>
	);
};
