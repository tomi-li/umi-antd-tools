import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { withRouter } from 'umi';
import _ from 'lodash';
import _isNil from 'lodash/isNil';
import _isFunc from 'lodash/isFunction';
import _isEqual from 'lodash/isEqual';
import _cloneDeep from 'lodash/cloneDeep';
import { mockRouteObj } from '@/util';

const InputGroup = Input.Group;

class Component extends React.Component {
  static propTypes = {
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    const { children, form, location } = props;
    console.log('props: ', props);
    const { setFields } = form;
    const { query } = location;
    const [firstKey, lastKey] = [children[0].key, children[1].key];

    setFields({
      [firstKey]: { value: query[firstKey] },
      [lastKey]: { value: query[lastKey] }
    });

    this.state = {
      value0: query[firstKey],
      value1: query[lastKey]
    };

    this.lastQuery = query;
  }

  componentWillReceiveProps(nextProps) {
    const { query } = mockRouteObj();
    const queryClone = _cloneDeep(query);
    if (!_isEqual(this.lastQuery, queryClone)) {
      this.lastQuery = queryClone;
      const { children, form } = nextProps;
      const { getFieldDecorator } = form;
      const { query } = mockRouteObj();
      const [firstKey, lastKey] = [children[0].key, children[1].key];

      getFieldDecorator(firstKey, {
        initialValue: query[firstKey]
      });
      getFieldDecorator(lastKey, {
        initialValue: query[lastKey]
      });

      this.setState({
        value0: query[firstKey],
        value1: query[lastKey]
      });
    }
  }

  handleChange0 = val => {
    this.setState({ value0: val }, this._shouldUpdate);
  };

  handleChange1 = val => {
    // 如果有 target.value 则取 target.value 否则 取 val
    const value = _.get(val, 'target.value', val);
    this.setState({ value1: value }, this._shouldUpdate);
  };

  _shouldUpdate = () => {
    const { form, children, onChange } = this.props;
    const { setFieldsValue } = form;
    const { value0, value1 } = this.state;
    const [firstKey, lastKey] = [children[0].key, children[1].key];

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
    const { children, form, location } = this.props;
    const { getFieldDecorator } = form;
    const { query } = location;
    const { value0, value1 } = this.state;
    const [first, last] = children;

    getFieldDecorator(first.key, {
      initialValue: query[first.key]
    });
    getFieldDecorator(last.key, {
      initialValue: query[last.key]
    });

    return (
      <InputGroup size="middle" compact>
        {React.cloneElement(first, { value: value0, onChange: this.handleChange0 })}
        {React.cloneElement(last, { value: value1, onChange: this.handleChange1 })}
      </InputGroup>
    );
  }
}
export default withRouter(Component);
