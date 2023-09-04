import { CartItemModel } from '@/models/CartItem.model';
import { ProductModel } from '@/models/Product.model';
import { simpleToast } from '@ui/toast/simpleToast';
import { CouponModel } from '@/models/Coupon.model';
import {
  OrderItemSummaryModel,
  OrderSummaryModel,
} from '@/models/OrderSummary.model';
import { applyCouponDiscount } from '@/helpers/applyCouponDiscount';
import { createSubject } from '@zetql/react';

export interface OrderCartSubject {
  itemsGroup: Map<string, CartItemModel>;
  coupon: CouponModel | null;
  increase: (productId: string, variantOption: Set<string>) => void;
  decrease: (productId: string, variantOption: Set<string>) => void;
  remove: (productId: string, variantOption: Set<string>) => void;
  add: (
    product: ProductModel,
    variantOption: Set<string>,
    quantity: number
  ) => void;
  summarizeReceipt: (
    param?: Pick<OrderCartSubject, 'itemsGroup' | 'coupon'>
  ) => OrderSummaryModel;
  selectCoupon: (c: CouponModel | null) => void;
}

const isSameOptionVariant = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) {
    return false;
  }
  for (const prop of a) {
    if (!b.has(prop)) {
      return false;
    }
  }
  return true;
};
export const orderCartState = createSubject<OrderCartSubject>(
  (set, get, subscribe) => {
    const changeAmount = (
      productId: string,
      variantOption: Set<string>,
      num: number,
      min: number,
      max?: number
    ) => {
      try {
        const itemsGroup = get().itemsGroup;
        const productItem = itemsGroup.get(productId)!;
        const newOptionVariant = productItem.variantList.map((variant) => {
          if (isSameOptionVariant(variantOption, variant.options)) {
            const quantity = Math.max(variant.quantity + num, min);
            return {
              options: variant.options,
              quantity:
                typeof max === 'number' ? Math.min(quantity, max) : quantity,
            };
          } else {
            return variant;
          }
        });
        const copy = new Map(itemsGroup);
        copy.set(productId, { ...productItem, variantList: newOptionVariant });
        set({ itemsGroup: copy });
      } catch (e) {
        console.error('!!!!noway 🫠', e);
        simpleToast('요청 수행중 문제가 발생하였습니다.', { toastId: 'cart' });
      }
    };
    const increase = (productId: string, variantOption: Set<string>) => {
      changeAmount(productId, variantOption, 1, 1);
    };
    const decrease = (productId: string, variantOption: Set<string>) => {
      changeAmount(productId, variantOption, -1, 1);
    };
    const selectCoupon = (coupon: null | CouponModel) => {
      set({ coupon });
    };

    const summarizeReceipt = (
      param?: Pick<OrderCartSubject, 'itemsGroup' | 'coupon'>
    ) => {
      const { itemsGroup, coupon } = param || get();
      const summarizedItem: Array<OrderItemSummaryModel> = [];
      let totalProductPrice = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, value] of itemsGroup) {
        const { variantList, product } = value;
        variantList.forEach(({ options, quantity }, i) => {
          let optionCharge = 0;
          summarizedItem.push({
            key: `${product.productId}_${i}`,
            options:
              product.option.filter(({ name, price }) => {
                if (options.has(name)) {
                  optionCharge += price;
                  return true;
                }
              }) || [],
            initialPrice: product.price,
            productName: product.name,
            optionCharge,
            quantity,
          });
          totalProductPrice += (optionCharge + product.price) * quantity;
        });
      }
      return {
        items: summarizedItem,
        totalProductPrice,
        coupon,
        couponDiscount: applyCouponDiscount(totalProductPrice, coupon),
      };
    };

    const remove = (productId: string, variantOption: Set<string>) => {
      try {
        const itemsGroup = get().itemsGroup;
        const productItem = itemsGroup.get(productId)!;
        if (!productItem) {
          return;
        }
        const newOptionVariant = productItem.variantList.filter((variant) => {
          return !isSameOptionVariant(variantOption, variant.options);
        });
        const copy = new Map(itemsGroup);
        if (newOptionVariant.length) {
          copy.set(productId, {
            ...productItem,
            variantList: newOptionVariant,
          });
        } else {
          copy.delete(productId);
        }
        set({ itemsGroup: copy });
        simpleToast('해당 옵션이 삭제 되었습니다.', { toastId: 'cart' });
      } catch (e) {
        console.log(e);
        console.error('!!!!noway 🫠');
        simpleToast('요청 수행중 문제가 발생하였습니다.', { toastId: 'cart' });
      }
    };
    subscribe((state) => {
      if (state.coupon && state.itemsGroup.size === 0) {
        setTimeout(() => {
          set({ coupon: null });
        });
      }
    });
    const add = (
      product: ProductModel,
      variantOption: Set<string>,
      quantity: number
    ) => {
      try {
        const { productId } = product;
        const itemsGroup = get().itemsGroup;
        let productItem = itemsGroup.get(productId)!;
        if (!productItem) {
          productItem = {
            variantList: [{ options: variantOption, quantity }],
            product: product,
          };
        } else {
          let existing = false;
          const newVariantList = productItem.variantList.map((variant) => {
            if (isSameOptionVariant(variantOption, variant.options)) {
              existing = true;
              return { ...variant, quantity: variant.quantity + quantity };
            } else {
              return variant;
            }
          });
          if (!existing) {
            newVariantList.push({ options: variantOption, quantity });
          }
          productItem = { variantList: newVariantList, product: product };
        }
        const copy = new Map(itemsGroup);
        copy.set(productId, productItem);
        set({ itemsGroup: copy });
        simpleToast('해당 옵션이 추가 되었습니다.', { toastId: 'cart' });
      } catch (e) {
        simpleToast('요청 수행중 문제가 발생하였습니다.', { toastId: 'cart' });
        console.error('!!!!noway 🫠');
      }
    };

    return {
      increase,
      decrease,
      remove,
      add,
      summarizeReceipt,
      selectCoupon,
      coupon: null,
      itemsGroup: new Map(),
    };
  }
);
