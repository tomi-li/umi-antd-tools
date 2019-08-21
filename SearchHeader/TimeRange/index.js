import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, LocaleProvider } from 'antd';
import moment from 'moment';
import enUS from 'antd/lib/locale-provider/en_US';
import _ from 'lodash';

const { RangePicker } = DatePicker;

/**
 * FormItem must be an Class
 */
export default class TimeRangePicker extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    showTime: PropTypes.bool,
    format: PropTypes.string, // unix or 'yyyy-mm-dd' or other time format,
    tz: PropTypes.string
  };

  static defaultProps = {
    format: 'unix',
    showTime: false,
    tz: 'Asia/Shanghai'
  };

  formatTime = (first, last) => {
    const { format, tz } = this.props;
    if (tz === 'Asia/Kolkata') {
      return this.indiaTimeFormat(first, last);
    }
    if (format === 'unix') {
      const firstTime = first
        .hour(0)
        .minute(0)
        .second(0)
        .unix();
      const lastTime = last
        .hour(23)
        .minute(59)
        .second(59)
        .unix();
      return `${firstTime}-${lastTime}`;
    }
    const firstTime = first
      .hour(0)
      .minute(0)
      .second(0)
      .format(format);
    const lastTime = last
      .hour(23)
      .minute(59)
      .second(59)
      .format(format);
    return `${firstTime}-${lastTime}`;
  };

  indiaTimeFormat = (first, last) => {
    const firstTime = first
      .startOf('day')
      .utcOffset(480)
      .add(2.5, 'hours')
      .unix();

    const lastTime = last
      .startOf('day')
      .utcOffset(480)
      .add(2.5, 'hours')
      .unix();
    return `${firstTime}-${lastTime}`;
  };

  retrieveValue = string => {
    const { format } = this.props;
    if (_.isNil(string)) return null;

    const [first, last] = string.split('-');

    if (format === 'unix') {
      return [first, last].map(e => moment.unix(e));
    }
    return [first, last].map(e => moment(e, format));
  };

  render() {
    const handleChange = value => {
      if (!_.isArray(value) || _.isEmpty(value)) {
        return this.props.onChange();
      }
      const formattedValue = this.formatTime(value[0], value[1]);
      this.props.onChange(formattedValue);
    };
    return (
      <LocaleProvider locale={enUS}>
        <RangePicker
          value={this.retrieveValue(this.props.value)}
          onChange={handleChange}
          showTime={this.props.showTime}
        />
      </LocaleProvider>
    );
  }
}
