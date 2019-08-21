import React, { useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon } from 'antd';
import styles from './index.less';

const sortStates = ['empty', 'asc', 'desc'];

Component.propTypes = {
  name: PropTypes.string.isRequired,
  canDesc: PropTypes.bool,
  canASC: PropTypes.bool,
  onChange: PropTypes.func,
  state: PropTypes.string
};

Component.defaultProps = {
  canDesc: false,
  canASC: true,
  onChange: _.noop,
  state: 'empty'
};

export default function Component (props) {
  const { name, canDesc, canASC, onChange, state } = props;

  // 循环状态工具类
  const getNextState = (state) => {
    const nextIndex = (_.indexOf(sortStates, state) + 1) % sortStates.length;
    return sortStates[nextIndex];
  };

  // 判断正确的 state
  const handleClick = () => {
    let nextState = getNextState(state);
    if (nextState === 'asc' && !canASC) {
      nextState = getNextState(nextState);
    } else if (nextState === 'desc' && !canDesc) {
      nextState = getNextState(nextState);
    }
    onChange(name, nextState);
  };

  return (
    <span key={name}
          className={classnames([styles['sort-tag'], styles[`state-${state}`]])}
          onClick={handleClick}>
      {name}
      <span className={styles['icons-wrapper']}>
        {canASC && <Icon className={styles['asc']} type={'caret-up'} />}
        {canDesc && <Icon className={styles['desc']} type={'caret-down'} />}
      </span>
    </span>
  );
}
