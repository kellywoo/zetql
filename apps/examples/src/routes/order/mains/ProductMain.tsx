import { ProductItemList } from '@/components/product/ProductItemList.tsx';
import { activeCategorySubject } from '@/subjects/category/activeCategory.subject.ts';
import styled from 'styled-components';
import { productQuery } from '@/subjects/product/product.query.ts';
import { useMemo } from 'react';
import { useQueryFetch, useSubjectValue } from '@zetql/react';
import { testQuery } from '@/subjects/test/test.query.ts';

const Wrapper = styled.div`
	padding: 2rem 2.5rem;
`;
export const ProductMain = () => {
	const products = useSubjectValue(productQuery, (state) => state.data.products);
	const activeCategoryId = useSubjectValue(activeCategorySubject, (s) => s.selected);
	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			return product.categoryId === activeCategoryId;
		});
	}, [activeCategoryId, products]);
	useQueryFetch(testQuery, { deps: 2 });
	return (
		<Wrapper>
			<ProductItemList products={filteredProducts} />
		</Wrapper>
	);
};
