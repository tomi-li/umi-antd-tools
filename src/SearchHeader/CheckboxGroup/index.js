import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import _ from 'lodash';

const { Group: CheckboxGroup } = Checkbox;

export default function Component(props) {
  const { key, value, onChange, children } = props;
  const formattedValue = _.isString(value) ? value.split(',') : value;
  return (
    <CheckboxGroup key={key} value={formattedValue} onChange={onChange}>
      {children}
    </CheckboxGroup>
  );
}
