import React from 'react';
import PropTypes from 'prop-types';
import { router, withRouter } from 'umi';
import _ from 'lodash';
import _omit from 'lodash/omit';
import _pickBy from 'lodash/pickBy';
import _keys from 'lodash/keys';
import _identity from 'lodash/identity';
import _mapValues from 'lodash/mapValues';
import _isArray from 'lodash/isArray';
import _isNil from 'lodash/isNil';
import SearchForm from './SearchForm';
import styles from './SearchHeader.less';

SearchHeader.propTypes = {
  // 手动设定还是自动设定
  manually: PropTypes.bool,
  // 在右侧可以放一些操作按钮
  right: PropTypes.element,
  // 比如想想有一个默认的配置 可以用 object 的方式写在这里
  // ！！！注意 因为该属性会在 load 之后起作用，所以在页面 fetch 数据的时候，使用 debounce 可以解决请求两次的问题
  initialValue: PropTypes.object,
  // 默认会自动更改 URL， 不需要设定值
  onSearch: PropTypes.func,
  // 如果默认 onSearch 的时候忽略一些属性， 设置这个值
  // eg： ['auditor', 'userId', 'videoId']
  // 那么在 更改 url 和重制 url 的时候 则忽略这些属性
  omitAttributes: PropTypes.array,
  // 如果页面比较长， 随着页面滚动 Search 和 Reset 回贴在屏幕最上方
  sticky: PropTypes.bool,
  // 控制是否显示 Reset
  showReset: PropTypes.bool
};

SearchHeader.defaultProps = {
  manually: false,
  right: null,
  initialValue: {},
  // onSearch 默认会在代码里面设置（因为需要调用 location 和 query 等属性）
  // 这里设置成 null
  onSearch: null,
  omitAttributes: [],
  sticky: false,
  showReset: true
};

function SearchHeader(props) {
  const {
    onSearch,
    manually,
    initialValue,
    children,
    right,
    style,
    location,
    omitAttributes,
    sticky,
    showReset
  } = props;
  const { pathname, query } = location;

  let items = children;
  if (_isNil(items)) {
    items = [];
  } else if (!_isArray(items)) {
    items = [children];
  }

  const defaultHandleSearch = values => {
    // 判断需不需要重置 page 参数
    // 默认参数为 page ，如果使用了其他的 page 参数 比如 pageNo, offset 那么这个属性不会起作用
    const needResetPage = !_.isNil(query) && _.isNumber(query.page) && query.page > 1;

    // 获取下一个 query
    const nextQuery = {
      // 取出现在 url 上的 query 所有 key， 但是去掉 属性中的 omitAttributes 的属性
      ..._omit(query, [..._keys(values), ...omitAttributes]),
      // 取出所有值中不为 undefined 的属性
      ..._pickBy(values, _identity),
      // 如果有属性为数组， 那么把它的值， 做 join(',') 处理
      ..._mapValues(_pickBy(values, _isArray), o => o.join(',') || undefined),
      // 如果需要重置 page 参数
      ...(needResetPage ? { page: 1 } : {})
    };

    // 更新 URL 为 nextQuery
    router.push({
      pathname,
      query: nextQuery
    });
  };

  return (
    <div className={styles.header} style={style}>
      <SearchForm
        query={query}
        onValueChange={onSearch || defaultHandleSearch}
        items={items}
        manually={manually}
        initialValue={initialValue}
        sticky={sticky}
        showReset={showReset}
      />
      {right}
    </div>
  );
}

export default withRouter(SearchHeader);
