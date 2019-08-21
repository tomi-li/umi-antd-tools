import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Affix, Button, Form, Input } from 'antd';
import _ from 'lodash';
import _debounce from 'lodash/debounce';
import _startCase from 'lodash/startCase';
import _isNil from 'lodash/isNil';
import _get from 'lodash/get';
import { CombineSearch, Group, NumberRange, SearchWithSelect, getFieldNameByKey } from '.';
import styles from './SearchHeader.less';

const FormItem = Form.Item;

SearchForm.propTypes = {
  query: PropTypes.object.isRequired,
  onValueChange: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
  manually: PropTypes.bool.isRequired,
  initialValue: PropTypes.object.isRequired,
  sticky: PropTypes.bool.isRequired,
  showReset: PropTypes.bool.isRequired
};

function SearchForm(props) {
  const { form, onValueChange, items, manually, initialValue, query, sticky, showReset } = props;
  const { getFieldDecorator, getFieldsValue } = form;

  const [sticking, setSticking] = useState(sticky);

  const handleChange = () => {
    // next tick
    setTimeout(() => onValueChange(getFieldsValue()), 0);
  };

  const getChildren = items =>
    items.map(el => {
      if (el.type === 'br') {
        return el;
      }

      const { key } = el;
      const { defaultValue, ...elProps } = el.props;

      const [name, label = _startCase(name)] = el.key.split('|');
      if (_isNil(name)) throw Error('name can not be empty');

      // to void debounce not working with hooks
      const onChange = useRef(
        el.type === NumberRange || el.type === Input ? _debounce(handleChange, 800) : handleChange
      );

      const props = {
        ...(manually ? {} : { onChange: onChange.current })
      };

      // 如果类别是 group 的话， 处理所有子类别
      if (el.type === Group) {
        return (
          <Group {...elProps} key={key} title={key} form={form}>
            {getChildren(elProps.children)}
          </Group>
        );
      }

      if (el.type === CombineSearch) {
        return (
          <FormItem key={key}>
            {React.cloneElement({ ...el, props: elProps }, { ...elProps, ...props, form })}
          </FormItem>
        );
      }

      if (el.type === SearchWithSelect) {
        return (
          <FormItem key={key}>
            {React.cloneElement({ ...el, props: elProps }, { ...elProps, ...props, form })}
          </FormItem>
        );
      }

      return (
        <FormItem key={key} label={label}>
          {getFieldDecorator(name, {
            initialValue: _.has(query, name) ? query[name] : defaultValue
          })(React.cloneElement({ ...el, props: elProps }, props))}
        </FormItem>
      );
    });

  const handleSearch = () => {
    onValueChange(getFieldsValue());
  };

  const handleReset = () => {
    const emptyObj = items.reduce((p, n) => {
      if (n.type === 'br') {
        return p;
      }
      // clean up group
      if (n.type === Group || n.type === CombineSearch) {
        const keys = n.props.children.map(e => getFieldNameByKey(e.key));

        const emptyObjes = keys.reduce((p, n) => ({ ...p, [n]: undefined }), {});
        return { ...p, ...emptyObjes };
      }
      const defaultValue = _get(n, ['props', 'defaultValue']) || undefined;
      return { ...p, [getFieldNameByKey(n.key)]: defaultValue };
    }, {});
    onValueChange({ ...emptyObj, ...initialValue }); // empty all fields
    props.form.resetFields(); // reset unsaved state
  };

  return (
    <Form layout="inline" style={{ display: 'inline' }}>
      {getChildren(items)}
      <Affix
        onChange={setSticking}
        style={{ display: 'inline-block' }}
        target={() => (sticky ? document.querySelector('#main-area') : null)}>
        <div className={classnames(styles['stick-wrapper'], { [styles['on']]: sticking })}>
          {manually && (
            <FormItem>
              <Button onClick={handleSearch} type="primary">
                Search
              </Button>
            </FormItem>
          )}
          {showReset && (
            <FormItem>
              <Button onClick={handleReset}>Reset</Button>
            </FormItem>
          )}
        </div>
      </Affix>
    </Form>
  );
}

export default Form.create()(SearchForm);
