import styled from 'styled-components';
import { LocaleNumber } from '@ui/formats/localeNumber';
import { OrderCartSubject } from '@/subjects/orderCart/orderCart.subject.ts';
import { OptionVariantModel } from '@/models/CartItem.model';
import { AppColor } from '@ui/style/AppColor';
import { AdditionalOptionPrice } from '@/components/unit/AdditionalOptionPrice';
import { CountInput } from '@ui/inputs/CountInput';
import { ProductModel } from '@/models/Product.model';
import { modalControlSubject } from '@/subjects/modal/modalControl.subject.ts';
import { useSubjectValue } from '@zetql/react';

const Wrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	padding: 1.5rem;
`;

const OptionRow = styled.dl`
	background-color: #fff;
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
	padding: 0.5rem 0 0.5rem 1rem;
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
const Unit = styled.span`
	padding-left: 4px;
	font-weight: 400;
`;
const DetailBox = styled.div``;
const SummaryBox = styled.div`
	border-top: 1px solid ${AppColor.border};
	padding: 1.2rem 0 0.5rem;
	margin-top: 1.5rem;
	display: flex;
	justify-content: space-between;
`;
const QuantityAction = styled.div`
	font-size: 1.3rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	flex: none;
`;
const TotalPrice = styled.span`
	font-size: 1.8rem;
	font-weight: 700;
	line-height: 2.4rem;
	display: flex;
`;
const RemoveButton = styled.button`
	background-color: ${AppColor.grayBg};
	outline: none;
	color: ${AppColor.red};
	border-radius: 5px;
	padding: 0 1rem;
	font-size: 1.2rem;
	height: 2.4rem;
`;

const Divider = styled.span`
	display: inline-flex;
	height: 2rem;
	width: 1px;
	margin: 0 1.6rem 0 1.5rem;
	background-color: ${AppColor.softGrayText};
`;
export const OrderItemCard = ({
	product,
	item,
	increase,
	decrease,
	remove,
}: {
	product: ProductModel;
	item: OptionVariantModel;
} & Pick<OrderCartSubject, 'increase' | 'decrease' | 'remove'>) => {
	const setProductDetailId = useSubjectValue(modalControlSubject, (state) => state.setProductDetailId);
	const options = [...item.options];
	const { optionChargeMap, name: productName, productId } = product;
	const optionCharge = options.reduce((p, c) => {
		return (optionChargeMap.get(c)?.price || 0) + p;
	}, 0);
	const price = product.price + optionCharge;
	let temp: number | undefined;
	return (
		<Wrapper>
			<DetailBox>
				<DefaultOptionRow>
					<dt>
						<a
							onClick={(e) => {
								e.preventDefault();
								setProductDetailId(productId);
							}}
						>
							{productName}
						</a>
					</dt>
					<dd>
						<LocaleNumber amount={price} unit={<Unit>원</Unit>} />
					</dd>
				</DefaultOptionRow>
				<AddedOptionRow className={'is-base'}>
					<dt>기본</dt>
					<dd>
						<LocaleNumber amount={product.price} unit={<Unit>원</Unit>} />
					</dd>
				</AddedOptionRow>
				{options.map((optionName) => {
					return (
						<AddedOptionRow key={optionName}>
							<dt>
								<span>{optionName}</span>
							</dt>
							<dd>
								{!(temp = optionChargeMap.get(optionName)?.price) ? (
									'무료'
								) : (
									<AdditionalOptionPrice>
										<LocaleNumber amount={temp} unit={<Unit>원</Unit>} />
									</AdditionalOptionPrice>
								)}
							</dd>
						</AddedOptionRow>
					);
				})}
			</DetailBox>
			<SummaryBox>
				<QuantityAction>
					<CountInput
						count={item.quantity}
						min={1}
						increase={() => increase(productId, item.options)}
						decrease={() => decrease(productId, item.options)}
					/>
					<Divider />
					<RemoveButton type={'button'} onClick={() => remove(productId, item.options)}>
						삭제
					</RemoveButton>
				</QuantityAction>
				<TotalPrice>
					<LocaleNumber amount={price * item.quantity} unit={<Unit>원</Unit>} />
				</TotalPrice>
			</SummaryBox>
		</Wrapper>
	);
};
