import React from 'react';
import PropTypes from 'prop-types';
import DataForm from './DataForm';

export const ITEM_PROPTYPES = {
  value: PropTypes.any,
  onChange: PropTypes.func
};

export class DataField {
  constructor(el, options, formItemProps) {
    this.el = el;
    this.options = options;
    this.formItemProps = formItemProps;
  }
}

export const createField = (el, options, formItemProps) => {
  return new DataField(el, options, formItemProps);
};

export default DataForm;
