import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import {Button, Form, Icon, Input, Popconfirm} from 'antd';
const FormItem = Form.Item;
import callApi from '../../../../../utils/fetch';
import {addPerson} from '../../action';

import style from './style.scss';
const cx = classNames.bind(style);

class PersonForm extends Component {
  static propTypes = {
    form: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      // firstName: '',
      // lastName: ''
    };
  }

  // savePerson = () => {
  //   const {firstName, lastName} = this.state;
  //   const url = 'page-2/person';
  //   const {dispatch, router} = this.context;
  //   //这里没有走 action, 直接发送 fetch 请求,对于不需要维护状态的请求,我们也可以直接调用 fetch
  //   return callApi({
  //     url,
  //     body: {
  //       firstName,
  //       lastName
  //     },
  //     method: 'post'
  //   }).then(
  //     (json) => {
  //       const {data} = json;
  //       const person = {
  //         id: data.id,
  //         firstName,
  //         lastName
  //       };
  //       dispatch(addPerson(person));
  //       router.goBack();
  //     },
  //     (error) => {
  //
  //     }
  //   );
  // };

  // handleChange = (field) => {
  //   return (event) => {
  //     const val = event.target.value;
  //     this.setState({
  //       [field]: val
  //     });
  //   };
  // };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const {firstName, lastName} = values;
        const url = 'page-2/person';
        const {dispatch, router} = this.context;
        //这里没有走 action, 直接发送 fetch 请求,对于不需要维护状态的请求,我们也可以直接调用 fetch
        return callApi({
          url,
          body: {
            firstName,
            lastName
          },
          method: 'post'
        }).then((json) => {
          const {data} = json;
          const person = {
            id: data.id,
            firstName,
            lastName
          };
          dispatch(addPerson(person));
          router.goBack();
          }, (error) => {}
        );
      }
    });
  };

  render() {
    const {firstName, lastName} = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{width: '300px', margin: '30px 10px'}}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('firstName', {
              rules: [{ required: true, message: 'Please input your firstName!' }],
            })(
              <Input placeholder="firstName" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('lastName', {
              rules: [{ required: true, message: 'Please input your lastName!' }],
            })(
              <Input placeholder="lastName" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">Save</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(PersonForm);
