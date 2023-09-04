import { StockModel } from '@/models/Stock.model.ts';
import { useEffect } from 'react';
import { ListFetcher } from '@ui/list/ListFetcher.tsx';
import { TableList } from '@ui/table/TableList.tsx';
import styled from 'styled-components';
import { TableGenerator } from '@ui/table/table.type.ts';
import { LocaleNumber } from '@ui/formats/localeNumber.tsx';
import { useSubjectValue } from '@zetql/react';
import { ErrorPage } from '@ui/error/ErrorPage.tsx';
import { relativeStockQuery } from '@/subjects/stock/relative-stock.query.ts';
import { UiButton } from '@ui/buttons';
import { AppGutter } from '@/routes/layout/AppLayout.tsx';
import { TableClassNames } from '@ui/table/table.style.ts';

const UpDown = styled.span`
  display: block;
  margin-top: 4px;
  color: #121212;
  &.is-down {
    color: #007aff;
  }
  &.is-up {
    color: #e74c3c;
  }
`;

const generator: TableGenerator<StockModel> = [
  {
    key: 'id',
    body: (data) => data.id.toString(),
    head: 'ID',
    width: '60px',
  },
  {
    key: 'name',
    body: (data) => data.name,
    head: 'Name',
    flex: 2.5,
  },
  {
    key: 'symbol',
    body: (data) => data.symbol,
    head: 'Symbol',
  },
  {
    key: 'company',
    body: (data) => data.company,
    head: 'Company',
  },
  {
    key: 'price',
    body: (data) => (
      <>
        <LocaleNumber amount={data.price} />
        <UpDown
          className={
            data.percent > 0
              ? 'is-up'
              : data.percent === 0
              ? undefined
              : 'is-down'
          }
        >
          {data.percent}%
        </UpDown>
      </>
    ),
    head: 'Price',
  },
];

const Controller = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  height: 60px;
  background-color: #f8f8f8;
  z-index: 4;
  ${UiButton} {
    margin-left: 10px;
  }
`;
const ScrollableWrapper = styled.div`
  overflow-y: scroll;
  height: 100%;
  position: relative;
`;

const StyledTableList = styled(TableList<StockModel>)`
  & .${TableClassNames.thead} {
    position: sticky;
    top: 60px;
  }
`;
const RelativeCursor = () => {
  const {
    isFetching,
    isFetchingPrev,
    isFetchingNext,
    isRefetching,
    data,
    error,
    nextCursor,
  } = useSubjectValue(relativeStockQuery);
  useEffect(() => {
    relativeStockQuery.fetchQuery((firstCursor) => {
      if (firstCursor) {
        // it will keep the old cache if it exists
        return firstCursor;
      }
      return { offset: undefined };
    }, 'stock');
  }, []);
  if (error) {
    return (
      <ErrorPage
        buttons={[
          {
            label: 'reload',
            onClick: () => {
              relativeStockQuery.refetchQuery();
            },
          },
        ]}
      />
    );
  }
  return (
    <ScrollableWrapper>
      <AppGutter>
        <Controller>
          <UiButton
            fillColor={'primary'}
            fillType={'line'}
            onClick={() => {
              relativeStockQuery.fetchQuery({ offset: undefined });
            }}
          >
            restart
          </UiButton>
          <UiButton
            fillColor={'primary'}
            fillType={'fill'}
            onClick={() => {
              relativeStockQuery.refetchQuery();
            }}
          >
            refetch
          </UiButton>
        </Controller>
        <StyledTableList
          isLoading={!relativeStockQuery.isInitiated() && isFetching}
          className={'default-table'}
          items={data}
          trackBy={(data) => data.id.toString()}
          generator={generator}
        />
        <ListFetcher
          hasNext={!!nextCursor}
          isFetching={isFetchingNext}
          recheckDeps={`${isRefetching}_${isFetchingPrev}`}
          fetch={relativeStockQuery.fetchNext}
        />
      </AppGutter>
    </ScrollableWrapper>
  );
};

export default RelativeCursor;
