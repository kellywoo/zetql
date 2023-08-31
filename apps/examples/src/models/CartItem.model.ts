import { ProductModel } from '@/models/Product.model';

export interface OptionVariantModel {
	options: Set<string>;
	quantity: number;
}

export interface CartItemModel {
	variantList: Array<OptionVariantModel>;
	product: ProductModel;
}
