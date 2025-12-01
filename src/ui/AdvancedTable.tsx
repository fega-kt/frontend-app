import { IMetaPanigation } from '@/api/service-base';
import { defaultMetaPanigate } from '@/utils/const';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TableProps } from 'antd/lib';
import React from 'react';

interface AdvancedTableProps<T>
  extends Omit<
    TableProps<T>,
    'dataSource' | 'columns' | 'loading' | 'onChange'
  > {
  dataSource: T[];
  errorMessage?: string | React.ReactNode;
  isError?: boolean;
  isLoading?: boolean;
  columns: ColumnsType<T>;
  meta?: IMetaPanigation;
  onChange?: (page: number, pageSize: number) => void;
}

export const AdvancedTable = <T,>({
  isError,
  isLoading,
  errorMessage = 'Error loading data',
  columns,
  dataSource,
  meta,
  onChange,
  ...rest
}: AdvancedTableProps<T>) => {
  const paginationInfo = meta || defaultMetaPanigate;

  return (
    <>
      {isError ? (
        <div> {errorMessage}</div>
      ) : (
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content', y: 'calc(100vh - 270px)' }}
          columns={columns}
          dataSource={dataSource}
          loading={isLoading}
          pagination={{
            current: paginationInfo.page,
            pageSize: paginationInfo.take,
            total: paginationInfo.itemCount,
            showSizeChanger: true,
            locale: {
              items_per_page: '/Trang',
            },
            onChange,
          }}
          {...rest}
        />
      )}
    </>
  );
};
