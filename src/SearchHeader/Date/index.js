import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, LocaleProvider } from 'antd';
import moment from 'moment';
import enUS from 'antd/lib/locale-provider/en_US';
import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';

/**
 * FormItem must be an Class
 */
export default class Date extends React.Component {

  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func
  };

  render () {
    const _formattedValue = (value) => (value ? moment.unix(value) : null);

    const handleChange = (value) => {
      if (!value || _isEmpty(value)) {
        return this.props.onChange();
      }
      this.props.onChange(value.unix());
    };

    return (
      <LocaleProvider locale={enUS}>
        <DatePicker
          value={_formattedValue(this.props.value)}
          onChange={handleChange}
        />
      </LocaleProvider>
    );
  }
}
