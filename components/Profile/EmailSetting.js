import React, { Component } from 'react'
import { Divider, Form, Icon, Input, Button, Tabs, Tooltip, DatePicker } from 'antd'
import { Row, Col } from 'reactstrap'
import { inject, observer } from 'mobx-react';

import LayoutMain from '../Main/LayoutMain'
const FormItem = Form.Item;

@inject('profileStore')
@observer
export class EmailSetting extends Component {

  state = {
    confirmDirty: false,
  }

  componentDidMount() {
    this.props.profileStore.getProfile()
    this.props.form.validateFields();
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }

  handleEmailChange = (e) => this.props.profileStore.setEmail(e.target.value);
  handlePasswordChange = () => this.props.profileStore.setPassword(password.value);

  handleSubmitPassword = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.profileStore.updatePassword();
      }
    });
  }
  handleSubmitEmail = (e) => {
    e.preventDefault();
    this.props.profileStore.updateEmail();
}

render() {
  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
  const passwordError = isFieldTouched('password') && getFieldError('password');
  const { email, loading, loadingP } = this.props.profileStore
  return (
    <div>
      <LayoutMain>
        <h6>ตั้งรหัสผ่าน</h6>
        <Row>
          <Col sm="4">
            <Form onSubmit={this.handleSubmitPassword}>
              <FormItem
                validateStatus={passwordError ? 'error' : ''}
                help={passwordError || ''}
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'กรุณาใส่รหัสผ่าน' },
                  {
                    validator: this.validateToNextPassword,
                  }],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="รหัสผ่านใหม่" size="large"
                    onChange={this.handlePasswordChange}
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={passwordError ? 'error' : ''}
                help={passwordError || ''}
              >
                {getFieldDecorator('confirm', {
                  rules: [{ required: true, message: 'กรุณาใส่รหัสผ่าน' },
                  {
                    validator: this.compareToFirstPassword,
                  }],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Confirm รหัสผ่านใหม่"
                    size="large"
                    onBlur={this.handleConfirmBlur}
                  />
                )}
              </FormItem>
              <FormItem>
                <Button
                  icon='retweet'
                  loading={loadingP}
                  type="primary"
                  htmlType="submit"
                  size='large'
                  disabled={this.hasErrors(getFieldsError())}
                >เปลี่ยนรหัสผ่านใหม่</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
        <Divider />
        <h6>เปลี่ยนอีเมลล์</h6>
        <Row>
          <Col sm="4">
            <Form onSubmit={this.handleSubmitEmail}>
              <FormItem>
                <Input
                  htmlType='email'
                  required
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  size="large"
                  placeholder="อีเมลล์"
                  value={email}
                  onChange={this.handleEmailChange}
                />
              </FormItem>
              <FormItem>
                <Button icon='retweet' loading={loading} type="primary" htmlType="submit" size='large'>เปลี่ยนอีเมลใหม่</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </LayoutMain>
    </div>
  )
}
}

export default Form.create()(EmailSetting)
