import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, router } from 'umi';
import { connect } from 'dva';
import { Pagination, Empty, Spin, Skeleton, Row } from 'antd';

/**
 * 依赖于 DVA loading 插件哦
 */
DataPaginationWrap.propTypes = {
  // 数据 array
  rows: PropTypes.array,
  // 数据总量
  count: PropTypes.number.isRequired,
  // 渲染数据方法
  renderItem: PropTypes.func,
  pagePropName: PropTypes.string,
  // 默认页数
  defaultPage: PropTypes.number,
  // 默认分页大小
  pageSizePropName: PropTypes.string,
  defaultPageSize: PropTypes.number,
  paginationProps: PropTypes.shape(Pagination.propTypes),
  // 列表包装器 classname
  listWrapperClassName: PropTypes.string,
  // row gutter
  gutter: PropTypes.number,
  // 包装器 classname
  wrapperClassName: PropTypes.string,
  // 支持布尔 或者 model name
  // 同时存在的话 布尔值优先
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  // 只有上面还是上下都有
  duet: PropTypes.bool,
  // 如果想自己处理分页方法的话
  onPage: PropTypes.func,
  // React 渲染时候的 key, 默认为数组顺序
  keyPropName: PropTypes.string
};

DataPaginationWrap.defaultProps = {
  rows: undefined,
  renderItem: undefined,
  defaultPage: 1,
  defaultPageSize: 20,
  paginationProps: undefined,
  pagePropName: 'page',
  pageSizePropName: 'pageSize',
  listWrapperClassName: undefined,
  duet: true,
  wrapperClassName: undefined,
  loading: false,
  gutter: 0,
  onPage: undefined,
  keyPropName: undefined
};

function DataPaginationWrap(props) {
  const { location, effects, children } = props;
  const {
    count,
    onPage,
    pagePropName,
    pageSizePropName,
    paginationProps,
    renderItem,
    rows,
    duet,
    loading,
    keyPropName,
    wrapperClassName,
    listWrapperClassName,
    gutter
  } = props;
  const { query, pathname } = location;
  const { [pagePropName]: page = 1, [pageSizePropName]: pageSize = 20 } = query;

  if (!_.isArray(rows) && _.isNil(children)) {
    return <Empty />;
  }

  /**
   * 如果用户传了 onPage 调用用户的
   * 如果没有， 打印到 url 上
   */
  const safeOnPage = (page, pageSize) => {
    if (_.isFunction(onPage)) {
      onPage(page, pageSize);
      return;
    }

    router.push({
      pathname,
      query: {
        ...query,
        [pagePropName]: page,
        [pageSizePropName]: pageSize
      }
    });
  };

  const safePaginationProps = {
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: safeOnPage,
    current: +page,
    pageSize: +pageSize,
    total: count,
    onChange: safeOnPage,
    showTotal: total => `Total Items：${total}`,
    ...paginationProps
  };

  const safeLoading = getSafeLoading(effects, loading);

  return (
    <div style={{ margin: '10px 0' }}>
      <Pagination {...safePaginationProps} style={{ marginBottom: 4 }} />
      <Spin spinning={safeLoading} wrapperClassName={wrapperClassName}>
        {/* 如果 loading 并且没有数据, 显示框架 */}
        {safeLoading && _.isEmpty(rows) && <Skeleton />}
        {/* 如果有 children 则不 render item */}
        {!safeLoading && !!children && children}
        {/* 如果不是 children 则 render item */}
        {!safeLoading && !children && (
          <Row gutter={gutter} className={listWrapperClassName}>
            {!_.isEmpty(rows) &&
              rows.map((each, index) =>
                React.cloneElement(renderItem(each, index), {
                  key: keyPropName ? each[keyPropName] : index
                })
              )}
          </Row>
        )}
      </Spin>
      {duet && <Pagination {...safePaginationProps} style={{ marginBottom: 4 }} />}
    </div>
  );
}

function getSafeLoading(effects, loading) {
  if (_.isBoolean(loading)) {
    return loading;
  }
  if (_.isNil(effects[loading])) {
    console.warn(`wrong effect name ${loading}`);
  }

  return effects[loading];
}

const mapState = ({ loading: { effects } }) => ({ effects });

export default connect(mapState)(withRouter(DataPaginationWrap));
