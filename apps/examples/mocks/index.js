import { Server } from 'miragejs';
import { categoryApi } from './api/categories';
import { productApi } from './api/products';
import { couponApi } from './api/coupons';
import { stockRelativeCursorApi, stockStaticCursorApi } from "./api/stocks";

const responses = [categoryApi, productApi, couponApi, stockStaticCursorApi, stockRelativeCursorApi];

function enableMirageMock() {
	return new Server({
		environment: 'development',
		routes() {
			this.namespace = '';
			this.timing = 500;
			responses.forEach(({ url, getHandler }) => {
				this.get(url, (_, req) => getHandler(req));
			});
		},
	});
}

export default enableMirageMock;
