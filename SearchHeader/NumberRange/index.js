import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const InputGroup = Input.Group;

/**
 * FormItem must be an Class
 */
export default class NumberRange extends React.Component {

  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func
  };

  render () {
    const { value, onChange } = this.props;
    const [value1, value2] = value
      ? value.split('-').map(e => e ? +e : '')
      : ['', ''];

    const handleChange1 = (e) => {
      if (!/^-?\d*$/.test(e.target.value)) return;
      const next = `${e.target.value}-${value2}`;
      if (next === '-') {
        onChange('');
      } else {
        onChange(next);
      }
    };

    const handleChange2 = (e) => {
      if (!/^-?\d*$/.test(e.target.value)) return;
      const next = `${value1}-${e.target.value}`;
      if (next === '-') {
        onChange('');
      } else {
        onChange(next);
      }
    };

    return (
      <InputGroup compact>
        <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" value={value1}
               onChange={handleChange1} />
        <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }}
               placeholder="~" disabled />
        <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum"
               value={value2} onChange={handleChange2} />
      </InputGroup>
    );
  }
}
