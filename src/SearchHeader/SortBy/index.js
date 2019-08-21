import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SortTag from './SortTag';

Component.propTypes = {
  options: PropTypes.array.isRequired
};

Component.defaultProps = {
  options: []
};

export default function Component (props) {
  const { value, onChange, options } = props;
  const sortMap = useRef({});

  useEffect(() => {
    if (_.isNil(value)) {
      sortMap.current = {};
      return;
    }
    value.split('-')
      .map(e => e.split('_'))
      .forEach(([key, value]) => sortMap.current[key] = value);
  }, [value]);

  const handleChange = (name, value) => {
    if (value === 'empty') {
      delete sortMap.current[name];
    } else {
      sortMap.current[name] = value;
    }

    const result = _.chain(sortMap.current)
      .map((value, key) => (key && value) && `${key}_${value}`)
      .compact()
      .join('-');
    onChange(result);
  };

  return options.map(e => {
    if (_.isString(e)) {
      const state = sortMap.current[e];
      return <SortTag key={e}
                      name={e}
                      state={state}
                      onChange={handleChange} />;
    }
    if (_.isArray(e)) {
      const canAsc = e.includes('asc');
      const canDesc = e.includes('desc');
      const name = e[0];
      const state = sortMap.current[name];
      return <SortTag key={name}
                      name={name}
                      state={state}
                      canASC={canAsc}
                      canDesc={canDesc}
                      onChange={handleChange} />;
    }
  });
}
