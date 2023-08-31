import { CategoryModel } from '@/models/Category.model';
import { fetchClient } from '@/utils/fetchClient';
import { createQuery } from '@zetql/react';

interface CategoryList {
	categories: Array<CategoryModel>;
}
const fetchCategories: () => Promise<CategoryList> = () => {
	return fetchClient('/categories').then(({ data }) => {
		return { categories: data };
	});
};
export const categoryQuery = createQuery<CategoryList, undefined>({
	query: fetchCategories,
	initData: { categories: [] },
});
