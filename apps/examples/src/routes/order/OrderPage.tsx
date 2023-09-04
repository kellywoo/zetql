import styled from 'styled-components';
import { AppMenuNav } from '@/routes/layout/AppMenuNav.tsx';
import { ProductMain } from '@/routes/order/mains/ProductMain.tsx';
import { categoryQuery } from '@/subjects/category/category.query';
import { productQuery } from '@/subjects/product/product.query';
import { ProductDetailModal } from '@/routes/order/modals/ProductDetailModal';
import { OrderSummaryModal } from '@/routes/order/modals/OrderSummaryModal';
import { SelectCouponModal } from '@/routes/order/modals/SelectCouponModal';
import { OrderCartMain } from '@/routes/order/mains/OrderCartMain.tsx';
import { useQueryFetch, useSubjectValue } from '@zetql/react';
import { AppGutter, AppLayout } from '@/routes/layout/AppLayout.tsx';
import { RelativeThrobber } from '@ui/throbber';
import { ErrorPage } from '@ui/error/ErrorPage.tsx';
import { activeCategorySubject } from '@/subjects/category/activeCategory.subject.ts';

const ProductSection = styled.section`
  flex: auto;
  min-width: 0;
  height: 100%;
  overflow-y: scroll;
`;
const CartSection = styled.section`
  flex: none;
  width: 340px;
  height: 100%;
  margin-left: 1rem;
`;

const ProductGuard = () => {
  const { isFetching, data, error, initiated } = useSubjectValue(productQuery);
  useQueryFetch(productQuery);
  if (!initiated && isFetching) {
    return <RelativeThrobber />;
  }
  if (error) {
    return (
      <ErrorPage
        buttons={[
          {
            label: 'refetch',
            onClick: () => {
              productQuery.refetchQuery();
            },
          },
        ]}
      />
    );
  }
  if (data) {
    return <ProductMain />;
  }
  return null;
};

const CategoryGuard = () => {
  const { isFetching, data, error, initiated } = useSubjectValue(categoryQuery);
  useQueryFetch(categoryQuery);
  if (!initiated && isFetching) {
    return <RelativeThrobber />;
  }
  if (error) {
    return (
      <ErrorPage
        buttons={[
          {
            label: 'refetch',
            onClick: () => {
              categoryQuery.refetchQuery();
            },
          },
        ]}
      />
    );
  }
  if (data) {
    return <OrderCartMain />;
  }
  return null;
};

const Wrapper = styled(AppGutter)`
  display: flex;
  height: 100%;
`;
const OrderPage = () => {
  const categories = useSubjectValue(categoryQuery, (s) => s.data.categories);
  const activeCategory = useSubjectValue(activeCategorySubject);
  return (
    <AppLayout
      header={
        <AppMenuNav
          menu={categories}
          activeMenu={activeCategory.selected}
          setActive={activeCategory.setSelected}
        />
      }
    >
      <Wrapper>
        <ProductSection>
          <ProductGuard />
        </ProductSection>
        <CartSection>
          <CategoryGuard />
        </CartSection>
      </Wrapper>
      <ProductDetailModal />
      <SelectCouponModal />
      <OrderSummaryModal />
    </AppLayout>
  );
};

export default OrderPage;
