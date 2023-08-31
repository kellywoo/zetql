import { orderCartState } from '@/subjects/orderCart/orderCart.subject.ts';
import { ProductModel } from '@/models/Product.model';
import { OptionCheckBox } from '@/components/optionCheckBox/OptionCheckBox';
import styled from 'styled-components';
import { CountInput } from '@ui/inputs/CountInput';
import { LocaleNumber } from '@ui/formats/localeNumber';
import { AppColor } from '@ui/style/AppColor';
import { useMemo, useState } from 'react';
import { productQuery } from '@/subjects/product/product.query';
import { AdditionalOptionPrice } from '@/components/unit/AdditionalOptionPrice';
import { CloseIcon } from '@ui/icons/CloseIcon';
import { CartItemModel } from '@/models/CartItem.model';
import { modalControlSubject } from '@/subjects/modal/modalControl.subject.ts';
import { useSubjectValue } from '@zetql/react';
import { AsideContainer, AsideFooter, AsideHeader, AsideModal } from '@ui/modals/AsideModal.tsx';

const BasicInfo = styled.h3`
	font-size: 2.4rem;
	margin-bottom: 20px;
	position: sticky;
	top: 0;
	z-index: 1;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
`;
const ActionButtonBox = styled.div`
	text-align: right;
	display: flex;
	gap: 0.75rem;
`;
const ActionButton = styled.button`
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
`;
const CartButton = styled.button`
	height: 5.4rem;
	font-size: 1.7rem;
	color: #333;
	background-color: #fff;
	border: 1px solid currentColor;
	border-radius: 1.2rem;
	width: 5.5rem;
	padding: 0;
	flex: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	margin-right: 0.5rem;
`;
const SummarySection = styled.div`
	display: flex;
	margin-bottom: 1.5rem;
	align-items: flex-end;
	justify-content: flex-end;
`;
const Summary = styled.p`
	font-size: 2rem;
	min-width: 16rem;
	text-align: right;
	vertical-align: bottom;
	> span:first-child {
		margin-right: 5rem;
		font-size: 1.5rem;
		color: ${AppColor.grayText};
	}
`;
const OptionSelectSection = styled.dl`
	margin-top: 5rem;
	> dt {
		margin-bottom: 2rem;
		&.space-between {
			display: flex;
			justify-content: space-between;
		}
	}
	> dd {
		line-height: 2.4rem;
	}
`;
const QuantitySection = styled.div`
	margin-top: 4rem;
	display: flex;
	justify-content: space-between;
`;
const CartPreviewSection = styled.div`
	margin-top: 5rem;
`;
const CartList = styled.ul`
	display: flex;
	align-items: flex-start;
	padding-top: 3rem;
	flex-wrap: wrap;
	gap: 1.5rem;
	> li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}
`;
const OptionSwitchButton = styled.button`
	width: 12rem;
	height: 13rem;
	padding: 2.5rem 1rem 1rem;
	background-color: ${AppColor.softGrayBg};
	border-radius: 12px;
	overflow: hidden;
	transition: background-color 0.3s;
	> p {
		font-size: 1.3rem;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-height: 1.2;
		max-height: 6.5rem;
		-webkit-box-orient: vertical;
		margin-bottom: 0.5rem;
	}
	&:active {
		background-color: ${AppColor.grayBg};
	}
`;
const RemoveButton = styled.button`
	position: absolute;
	width: 2rem;
	height: 2rem;
	background-color: #333;
	top: 0.5rem;
	right: 0.75rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
`;
const ProductDetailContent = ({ product, onClose }: { product: ProductModel; onClose: () => void }) => {
	const { productInCarts, add, remove, summarizeReceipt } = useSubjectValue(orderCartState, (s) => {
		return {
			add: s.add,
			remove: s.remove,
			summarizeReceipt: s.summarizeReceipt,
			productInCarts: s.itemsGroup.get(product.productId),
		};
	});
	const setOrderSummary = useSubjectValue(modalControlSubject, (s) => s.setOrderSummary);
	const [quantity, setQuantity] = useState(1);
	const [optionSelected, setOptionSelected] = useState<Set<string>>(new Set());
	const variantList = useMemo(() => {
		if (!productInCarts) {
			return [];
		} else {
			return productInCarts.variantList.map(({ options, quantity }) => {
				return { options, optionName: options.size ? [...options].join(', ') : '기본', quantity };
			});
		}
	}, [productInCarts?.variantList]);
	const onChange = (set: Set<string>) => {
		const sortedSet = new Set(product.option.filter(({ name }) => set.has(name)).map(({ name }) => name));
		setOptionSelected(sortedSet);
	};
	const optionNames = [...optionSelected];
	const optionCharge = optionNames.reduce((p, c) => {
		return p + (product.optionChargeMap.get(c)?.price || 0);
	}, 0);
	const price = product.price + optionCharge;
	const hasOption = Boolean(product.optionChargeMap.size);
	const placeAnOrder = () => {
		const item: Map<string, CartItemModel> = new Map();
		item.set(product.productId, { product, variantList: [{ options: optionSelected, quantity }] });
		const receipt = summarizeReceipt({ itemsGroup: item, coupon: null });
		onClose();
		setOrderSummary(receipt);
	};
	return (
		<>
			<AsideHeader title={'메뉴 선택'}/>
			<AsideContainer>
				<BasicInfo>
					<span>{product.name}</span>
					<div>
						<LocaleNumber amount={product.price} />
					</div>
				</BasicInfo>
				<OptionSelectSection>
					<dt className={'space-between'}>
						<span>옵션</span>
						{hasOption && (
							<p style={{ color: AppColor.point }}>
								<AdditionalOptionPrice>
									<LocaleNumber amount={optionCharge} />
								</AdditionalOptionPrice>
							</p>
						)}
					</dt>
					<dd>
						{hasOption && <OptionCheckBox options={product.option} onChange={onChange} selected={optionSelected} />}
					</dd>
				</OptionSelectSection>
				<QuantitySection>
					<div style={{ marginRight: '2rem' }}>
						<LocaleNumber amount={price} />
						{hasOption && (
							<p style={{ color: AppColor.point, marginTop: '3px' }}>
								({optionNames.length ? optionNames.join(', ') : '옵션 선택 없음'})
							</p>
						)}
					</div>
					<CountInput
						size={'2.8rem'}
						fontSize={'2rem'}
						min={1}
						increase={() => {
							setQuantity((n) => n + 1);
						}}
						decrease={() => {
							setQuantity((n) => {
								return n - 1 < 1 ? n : n - 1;
							});
						}}
						count={quantity}
					/>
				</QuantitySection>

				{!!variantList.length && (
					<CartPreviewSection>
						<dt>카트에 추가한 옵션 (클릭시 해당 옵션으로 변경합니다.)</dt>
						<dd>
							<CartList>
								{variantList.map(({ optionName, options, quantity }) => {
									return (
										<li key={optionName}>
											<OptionSwitchButton
												onClick={() => {
													setOptionSelected(options);
												}}
											>
												<p>{optionName}</p>
												<span className={'fc-point fs-small'}>(x&nbsp;{quantity})</span>
											</OptionSwitchButton>

											<RemoveButton
												type={'button'}
												aria-label={'remove item from cart'}
												onClick={(e: any) => {
													e.stopPropagation();
													remove(product.productId, options);
												}}
											>
												<CloseIcon />
											</RemoveButton>
										</li>
									);
								})}
							</CartList>
						</dd>
					</CartPreviewSection>
				)}
			</AsideContainer>
			<AsideFooter>
				<SummarySection>
					<Summary>
						<span>
							총금액 (<LocaleNumber amount={price} unit={''} /> x {quantity})
						</span>
						<LocaleNumber amount={price * quantity} />
					</Summary>
				</SummarySection>
				<ActionButtonBox>
					<ActionButton onClick={placeAnOrder}>구매</ActionButton>
					<ActionButton
						type={'button'}
						onClick={() => {
							add(product, optionSelected, quantity);
							setOptionSelected(new Set());
							setQuantity(1);
						}}
					>
						담기
					</ActionButton>
				</ActionButtonBox>
			</AsideFooter>
		</>
	);
};
export const ProductDetailModal = () => {
	const { productDetailId, setProductDetailId } = useSubjectValue(modalControlSubject);
	const { data } = useSubjectValue(productQuery);
	const product = data.products.find((p: ProductModel) => {
		return p.productId === productDetailId;
	});
	const onClose = () => {
		setProductDetailId(null);
	};
	return (
		<AsideModal isOpen={!!product} onRequestClose={onClose} showCloseButton>
			{product ? <ProductDetailContent product={product} onClose={onClose} /> : null}
		</AsideModal>
	);
};
