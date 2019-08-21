import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Col } from 'antd';
import _ from 'lodash';
import { DataField } from '.';

const FormItem = Form.Item;

DataForm.propTypes = {
  data: PropTypes.object,
  onSubmit: PropTypes.func,
  formProps: PropTypes.object,
  submitButtonProps: PropTypes.object,
  submitText: PropTypes.string
};

DataForm.defaultProps = {
  onSubmit: undefined,
  formProps: {},
  submitButtonProps: {},
  submitText: 'Submit'
};

function DataForm(props) {
  const { form, children } = props;
  const { data, onSubmit, formProps, submitButtonProps, submitText } = props;
  const { getFieldDecorator } = form;

  const items = _.isArray(children) ? children : [children];

  const renderItem = (item, i) => {
    if (_.isNil(item)) {
      return null;
    }

    // 如果要是有 children， 先递归 children
    if (_.has(item, 'props.children')) {
      const safeChildren = _.isArray(item.props.children)
        ? item.props.children
        : [item.props.children];
      return React.cloneElement(item, {
        key: i,
        children: safeChildren.map((e, i) => renderItem(e, i))
      });
    }

    // 如果要是 DataField 类型， 处理类型
    if (item instanceof DataField) {
      const { el, options, formItemProps } = item;
      const [fieldName, label] = el.key.split('|');
      return (
        <FormItem key={fieldName} label={label} {...formItemProps}>
          {getFieldDecorator(fieldName, {
            initialValue: _.get(data, fieldName),
            ...options
          })(el)}
        </FormItem>
      );
    }
    // 返回原 item
    return item;
  };

  return (
    <Form layout="vertical" {...formProps}>
      {items.map(renderItem)}
      {_.isFunction(onSubmit) && (
        <FormItem>
          <Button type="primary" onClick={() => onSubmit(form)} {...submitButtonProps}>
            {submitText}
          </Button>
        </FormItem>
      )}
    </Form>
  );
}

export default Form.create()(DataForm);
