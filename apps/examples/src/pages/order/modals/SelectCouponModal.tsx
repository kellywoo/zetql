import styled from 'styled-components';
import { LocaleNumber } from '@ui/formats/localeNumber';
import { AppColor } from '@ui/style/AppColor';
import { CloseIcon } from '@ui/icons/CloseIcon';
import { modalControlSubject } from '@/subjects/modal/modalControl.subject.ts';
import { couponQuery } from '@/subjects/coupon/coupon.query';
import { CouponModel, CouponType } from '@/models/Coupon.model';
import { orderCartState } from '@/subjects/orderCart/orderCart.subject.ts';
import { useQueryFetch, useSubjectValue } from '@zetql/react';
import { ContentModal } from '@ui/modals/ContentModal.tsx';

const Wrapper = styled.div`
	height: 1000px;
	max-height: 80vh;
	overflow-y: auto;
	position: relative;
`;

const Header = styled.header`
	font-size: 1.8rem;
	padding: 3rem 2.5rem 1.5rem;
	margin-bottom: 1rem;
	position: sticky;
	top: 0;
	background-color: #fff;
	z-index: 2;
`;
const Title = styled.h2`
	margin-bottom: 2.5rem;
`;
const Container = styled.div`
	max-height: 70vh;
	padding: 0 2.5rem 5rem;
`;

const CloseButton = styled.button`
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 5rem;
	height: 5rem;
	background-color: transparent;
	color: #333;
	top: 1rem;
	right: 1rem;
	border-radius: 0;
	z-index: 2;
`;
const LoadingBox = styled.div`
	display: flex;
	height: 200px;
	align-items: center;
	justify-content: center;
`;
const CouponList = styled.ul`
	> li {
		border-radius: 1rem;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
		height: 8rem;
		display: flex;
		align-items: center;
		overflow: hidden;
		&.is-selected {
			opacity: 0.7;
		}
		& + li {
			margin-top: 1rem;
		}
	}
`;
const Icon = styled.span`
	display: flex;
	flex: none;
	width: 8rem;
	height: 100%;
	font-size: 3rem;
	align-items: center;
	justify-content: center;
	background-color: #f3e7de;
`;
const Content = styled.div`
	flex: auto;
	min-width: 0;
	padding-left: 2rem;
`;
const Name = styled.strong`
	display: block;
	font-weight: 700;
	font-size: 1.6rem;
`;
const Desc = styled.div`
	margin-top: 4px;
	font-size: 1.4rem;
`;
const Action = styled.button`
	flex: none;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 8rem;
	text-decoration: underline;
	color: ${AppColor.point};
	&.is-selected {
		color: ${AppColor.softGrayText};
		text-decoration: none;
	}
`;
const WithdrawCoupon = styled.div`
	text-align: right;
	margin-bottom: 2rem;
	> button {
		padding: 1rem 2rem;
		background-color: #e5e5e5;
		border-radius: 2rem;
	}
`;
const IsLoading = () => {
	return <LoadingBox>is Loading...</LoadingBox>;
};
const IsReady = ({ coupons, onClose }: { coupons: Array<CouponModel>; onClose: () => void }) => {
	const { coupon: selectedCoupon, selectCoupon } = useSubjectValue(orderCartState);
	return (
		<Container>
			{selectedCoupon ? (
				<WithdrawCoupon>
					<button type={'button'} onClick={() => selectCoupon(null)}>
						쿠폰 해제하기
					</button>
				</WithdrawCoupon>
			) : null}
			<CouponList>
				{coupons.map((coupon) => {
					const isAmountCoupon = coupon.type === CouponType.amount;
					const isSelected = selectedCoupon?.id === coupon.id;
					return (
						<li key={coupon.id} className={isSelected ? 'is-selected' : undefined}>
							<Icon>{isAmountCoupon ? '$' : '%'}</Icon>
							<Content>
								<Name>{coupon.name}</Name>
								<Desc>
									{isAmountCoupon ? (
										<span>
											<LocaleNumber amount={coupon.price} /> 할인
										</span>
									) : (
										<span>{coupon.price}% 할인</span>
									)}
								</Desc>
							</Content>
							<Action
								as={isSelected ? 'span' : 'button'}
								className={isSelected ? 'is-selected' : undefined}
								onClick={() => {
									selectCoupon(coupon);
									onClose();
								}}
							>
								{isSelected ? '사용중' : '사용하기'}
							</Action>
						</li>
					);
				})}
			</CouponList>
		</Container>
	);
};
const SelectCouponContent = ({ onClose }: { onClose: () => void }) => {
	const { isLoading, data, error } = useSubjectValue(couponQuery);
	return (
		<>
			<Wrapper>
				<Header>
					<Title>쿠폰 사용</Title>
				</Header>
				{isLoading ? <IsLoading /> : <IsReady coupons={data.coupons} onClose={onClose} />}
			</Wrapper>
			<CloseButton type={'button'} aria-label={'close'} onClick={onClose}>
				<CloseIcon />
			</CloseButton>
		</>
	);
};

export const SelectCouponModal = () => {
	const { showCouponSelectModal, setShowCouponSelectModal } = useSubjectValue(modalControlSubject);
	useQueryFetch(couponQuery, { disabled: !showCouponSelectModal });
	const onClose = () => {
		setShowCouponSelectModal(false);
	};
	return (
		<ContentModal isOpen={showCouponSelectModal} onRequestClose={onClose} showCloseButton>
			<SelectCouponContent onClose={onClose} />
		</ContentModal>
	);
};
