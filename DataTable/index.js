import React from 'react';
import PropTypes from 'prop-types';
import { router, withRouter } from 'umi';
import { Table } from 'antd';
import _isFunction from 'lodash/isFunction';

DataTable.propTypes = {
  rows: PropTypes.any,
  count: PropTypes.number,
  columns: PropTypes.array,
  onPage: PropTypes.func,
  page: PropTypes.number,
  pageSize: PropTypes.number
};

function DataTable(props) {
  const { rows, count, columns, location, onPage, ...rawProps } = props;
  const { query, pathname } = location;
  // const { page, pageSize } = query;
  const page = +(props.page || query.page);
  const pageSize = +(props.pageSize || query.pageSize);

  const defaultOnPage = (page, pageSize) => {
    router.push({
      pathname,
      query: {
        ...query,
        page,
        pageSize
      }
    });
  };

  const handleOnPage = _isFunction(onPage) ? onPage : defaultOnPage;

  // if page exceed.
  if (typeof count === 'number' && pageSize * (page - 1) >= count && count !== 0) {
    const lastPage = Math.ceil(count / pageSize);
    handleOnPage(lastPage, pageSize);
  }

  return (
    <Table
      size="middle"
      rowKey={(e, i) => String(i)}
      dataSource={rows || []}
      columns={columns}
      loading={!rows}
      pagination={{
        current: +page,
        total: count,
        pageSize: +pageSize,
        onChange: handleOnPage,
        onShowSizeChange: handleOnPage,
        showSizeChanger: true,
        showQuickJumper: true,
        size: 'middle'
      }}
      {...rawProps}
    />
  );
}

export default withRouter(DataTable);
