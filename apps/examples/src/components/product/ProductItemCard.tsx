import { ProductModel } from '@/models/Product.model';
import styled from 'styled-components';
import { LocaleNumber } from '@ui/formats/localeNumber';
import { SyntheticEvent } from 'react';
import { AppColor } from '@ui/style/AppColor';
const Wrapper = styled.a`
	position: relative;
	display: flex;
	flex-direction: column;
`;
const Image = styled.div`
	height: 11rem;
`;
const Content = styled.dl`
	flex: auto;
	width: 100%;
	background-color: ${AppColor.softGrayBg};
	padding: 1.25rem 1.5rem 1rem;
	height: 8.25rem;
	> dt {
		font-size: 14px;
		line-height: 1.2;
		height: 36px;
		word-break: break-all;
		letter-spacing: 0.1px;
		span {
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
		margin-top: 4px;
		font-size: 15px;
		font-weight: 700;
		float: right;
	}
`;
const Unit = styled.span`
	color: #a0a2a6;
	padding-left: 4px;
	font-weight: 400;
`;
export const ProductItemCard = ({ item, onClick }: { item: ProductModel; onClick?: (id: string) => void }) => {
	return (
		<Wrapper
			onClick={(e: SyntheticEvent) => {
				e.preventDefault();
				onClick?.(item.productId);
			}}
		>
			<Image></Image>
			<Content>
				<dt>
					<span>{item.name}</span>
				</dt>
				<dd>
					<LocaleNumber amount={item.price} unit={<Unit>원</Unit>} />
				</dd>
			</Content>
		</Wrapper>
	);
};
