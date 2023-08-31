import { fetchClient } from '@/utils/fetchClient';
import { ProductModel } from '@/models/Product.model';
import { simpleToast } from '@ui/toast/simpleToast';
import { createQuery } from '@zetql/react';

interface ProductQueryState {
	products: Array<ProductModel>;
}
const fetchProducts: () => Promise<ProductQueryState> = () => {
	return fetchClient('/products')
		.then(({ data }) => {
			const products = data.map((product: { option?: Array<{ name: string; price: number }> }) => {
				const optionChargeMap = new Map<string, { name: string; price: number }>();
				product.option =
					product.option?.map(({ name, price }) => {
						const option = { name, price: price || 0 };
						optionChargeMap.set(name, option);
						return option;
					}) || [];
				return { ...product, optionChargeMap };
			});
			return {
				products,
			};
		})
		.catch((e) => {
			console.error(e);
			simpleToast('작업을 수행할 수 없습니다. 잠시 뒤 다시 해주세요.');
			throw e;
		});
};

export const productQuery = createQuery<ProductQueryState, undefined>({
	query: fetchProducts,
	initData: { products: [] },
});
