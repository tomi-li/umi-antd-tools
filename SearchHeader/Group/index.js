import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Button, Icon, Form } from 'antd';
import _startCase from 'lodash/startCase';
import _isNil from 'lodash/isNil';

const FormItem = Form.Item;

export default class extends React.Component {

  static propTypes = {
    title: PropTypes.string, // display at button
    form: PropTypes.object // ignore. auto-inject from search header
  };

  static defaultProps = {
    title: 'Group Select'
  };

  render () {
    const { children, form, title } = this.props;
    const keys = children.map(e => e.key.split('|'));
    const values = form.getFieldsValue(keys.map(e => e[0]));

    const descriptions = keys.reduce((p, n) => {
      const [name, label = _startCase(name)] = n;
      if (!_isNil(values[name]) && values[name] !== '') {
        p.push(`${label} : ${values[name]}`);
      }
      return p;
    }, []);

    const displayText = descriptions.length > 0
      ? descriptions.join(',')
      : title;

    const markedChildren = children.map(each => {
      return React.cloneElement(each, {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      });
    });

    return (
      <FormItem>
        <Popover
          content={markedChildren}
          trigger="click"
          placement="bottomLeft">
          <Button>{displayText}<Icon type="down" /></Button>
        </Popover>
      </FormItem>
    );
  }
}
