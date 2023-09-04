import { StockModel } from '@/models/Stock.model.ts';
import { useEffect, useState } from 'react';
import { ListFetcher } from '@ui/list/ListFetcher.tsx';
import { staticStockQuery } from '@/subjects/stock/static-stock.query.ts';
import { TableList } from '@ui/table/TableList.tsx';
import styled from 'styled-components';
import { TableGenerator } from '@ui/table/table.type.ts';
import { LocaleNumber } from '@ui/formats/localeNumber.tsx';
import { useSubjectValue } from '@zetql/react';
import { ErrorPage } from '@ui/error/ErrorPage.tsx';
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
  width: 100%;
  height: 60px;
  z-index: 4;
  background-color: #f8f8f8;
  label {
    display: block;
  }
  select {
    width: 100px;
    padding: 0 10px;
    border: none;
    height: 40px;
    margin-left: 10px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin-right: 10px;
  }
  ${UiButton} {
    margin-left: 10px;
  }
`;

const StyledTableList = styled(TableList<StockModel>)`
  & .${TableClassNames.thead} {
    position: sticky;
    top: 60px;
  }
`;
const pageSize = [10, 20, 30];

const ScrollableWrapper = styled.div`
  overflow-y: scroll;
  height: 100%;
  position: relative;
`;
const StaticCursor = () => {
  const {
    isFetching,
    isRefetching,
    isFetchingPrev,
    isFetchingNext,
    data,
    error,
    nextCursor,
  } = useSubjectValue(staticStockQuery);
  const [size, setSize] = useState(pageSize[0]);
  useEffect(() => {
    const cacheKey = `stock_${size}`;
    staticStockQuery.fetchQuery((firstCursor) => {
      if (firstCursor) {
        // it will keep the old cache if it exists
        return firstCursor;
      }
      return { size, page: 1 };
    }, cacheKey);
  }, [size]);
  if (error) {
    return (
      <ErrorPage
        buttons={[
          {
            label: 'reload',
            onClick: () => {
              staticStockQuery.refetchQuery();
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
          <label htmlFor={'size'}>Page Size</label>
          <select
            id={'size'}
            defaultValue={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
            }}
          >
            {pageSize.map((n) => {
              return (
                <option value={n} key={n.toString()}>
                  {n.toString()}
                </option>
              );
            })}
          </select>
          <UiButton
            fillColor={'primary'}
            fillType={'line'}
            onClick={() => {
              staticStockQuery.fetchQuery({ size, page: 1 });
            }}
          >
            restart
          </UiButton>
          <UiButton
            fillColor={'primary'}
            fillType={'fill'}
            onClick={() => {
              staticStockQuery.refetchQuery();
            }}
          >
            refetch
          </UiButton>
        </Controller>
        <StyledTableList
          isLoading={!staticStockQuery.isInitiated() && isFetching}
          className={'default-table'}
          items={data}
          trackBy={(item) => item.id.toString()}
          generator={generator}
        />
        <ListFetcher
          hasNext={!!nextCursor}
          isFetching={isFetchingNext}
          recheckDeps={`${isRefetching}_${isFetchingPrev}`}
          fetch={staticStockQuery.fetchNext}
        />
      </AppGutter>
    </ScrollableWrapper>
  );
};

export default StaticCursor;
