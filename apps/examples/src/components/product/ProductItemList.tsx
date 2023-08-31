import { ProductItemCard } from '@/components/product/ProductItemCard';
import { ProductModel } from '@/models/Product.model';
import styled from 'styled-components';
import { modalControlSubject } from '@/subjects/modal/modalControl.subject.ts';
import { useSubjectValue } from '@zetql/react';

const ItemList = styled.ul`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-wrap: wrap;
	gap: 20px;
	padding-top: 2rem;
`;
const ItemCard = styled.li`
	width: 16rem;
	background-color: #fff;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 10px 28px rgb(0 0 0 / 0.15);
`;
export const ProductItemList = ({ products }: { products: Array<ProductModel> }) => {
	const setProductDetailId = useSubjectValue(modalControlSubject, (state) => state.setProductDetailId);
	const openProductDetail = (item: ProductModel) => {
		setProductDetailId(item.productId);
	};
	return (
		<ItemList>
			{products.map((product) => {
				return (
					<ItemCard key={product.productId}>
						<ProductItemCard item={product} onClick={() => openProductDetail(product)} />
					</ItemCard>
				);
			})}
		</ItemList>
	);
};
