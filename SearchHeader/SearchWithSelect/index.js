import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';
import { withRouter } from 'umi';
import _isNil from 'lodash/isNil';
import _isFunc from 'lodash/isFunction';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import { mockRouteObj } from '@/util';

const { Search } = Input;

class Component extends React.Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    const { form, location, options = [] } = props;
    const { setFields } = form;
    const { query } = location;
    const [firstKey, lastKey] = ['attribute', 'keyword'];

    setFields({
      [firstKey]: { value: query[firstKey] },
      [lastKey]: { value: query[lastKey] && decodeURIComponent(query[lastKey]) }
    });

    this.state = {
      value0: query[firstKey] || options[0].value,
      value1: query[lastKey] && decodeURIComponent(query[lastKey])
    };

    this.lastQuery = query;
  }

  componentWillReceiveProps(nextProps) {
    const { query } = mockRouteObj();
    const queryClone = _cloneDeep(query);
    if (!_isEqual(this.lastQuery, queryClone)) {
      this.lastQuery = queryClone;
      const { form } = nextProps;
      const { getFieldDecorator } = form;
      const { query } = mockRouteObj();
      const [firstKey, lastKey] = ['attribute', 'keyword'];

      getFieldDecorator(firstKey, {
        initialValue: query[firstKey]
      });
      getFieldDecorator(lastKey, {
        initialValue: query[lastKey]
      });
    }
  }

  onChangeSearchType = val => {
    this.setState({ value0: val });
  };

  onSearch = val => {
    this.setState({ value1: encodeURIComponent(val) }, this._shouldUpdate);
  };

  _shouldUpdate = () => {
    const { form, onChange } = this.props;
    const { setFieldsValue } = form;
    const { value0, value1 } = this.state;
    const [firstKey, lastKey] = ['attribute', 'keyword'];

    if (!_isNil(value0) && !_isNil(value1)) {
      setFieldsValue({
        [firstKey]: value0,
        [lastKey]: value1
      });
    } else {
      setFieldsValue({
        [firstKey]: undefined,
        [lastKey]: undefined
      });
    }

    if (_isFunc(onChange)) onChange();
  };

  render() {
    const { form, location, options } = this.props;
    const { getFieldDecorator } = form;
    const { query } = location;
    const { value0, value1 } = this.state;
    const [first, last] = [{ key: 'attribute' }, { key: 'keyword' }];

    getFieldDecorator(first.key, {
      initialValue: query[first.key]
    });
    getFieldDecorator(last.key, {
      initialValue: query[last.key]
    });

    const searchBeforeCmp = options.map((item, i) => (
      <Select.Option key={i.toString()} value={item.value}>
        {item.name}
      </Select.Option>
    ));

    const selectBefore = (
      <Select defaultValue={value0} onChange={this.onChangeSearchType}>
        {searchBeforeCmp}
      </Select>
    );

    return (
      <Search
        addonBefore={selectBefore}
        placeholder="input search text"
        onSearch={this.onSearch}
        defaultValue={value1}
      />
    );
  }
}
export default withRouter(Component);
