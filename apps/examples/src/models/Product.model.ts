export interface ProductOptionModel {
	name: string;
	price: number;
}
export interface ProductModel {
	categoryId: string;
	productId: string;
	name: string;
	price: number;
	option: Array<ProductOptionModel>;
	optionChargeMap: Map<string, { name: string; price: number }>;
}
