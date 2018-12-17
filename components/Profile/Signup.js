import React, { Component } from 'react';
import Link from 'next/link'
import { Button, Input, Form, Icon, Divider } from 'antd';
import { inject, observer } from 'mobx-react';

import Head from '../head'

const FormItem = Form.Item

@inject('authStore')
@observer
class Signup extends Component {
  state = {
    confirmDirty: false,
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  handleEmailChange = () => this.props.authStore.setEmail(email.value);
  handlePasswordChange = () => this.props.authStore.setPassword(password.value);

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.register()
  };

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

  facebookSignup = () => this.props.authStore.facebookSignup()
  googleSignup = () => this.props.authStore.googleSignup()

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const emailError = isFieldTouched('email') && getFieldError('email');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    const { loading } = this.props.authStore;
    return (
      <div >
        <Head />
        <section className="login-block">
          <div className="containers">
            <h1 className="headerH">EPISODE2 <Icon type="safety-certificate" theme="outlined" /></h1>
            <hr />
            <div className="row">
              <div className="col-md-4 login-sec">
                <h2 className="text-right"><Icon type="usergroup-add" theme="outlined" /> ลงทะเบียน</h2>
                <div style={{ margin: '1em 0' }}>
                  <Button onClick={this.googleSignup} type="danger" size="large" block ghost><Icon style={{ fontSize: 20 }} type="google" /> ลงทะเบียนโดย Google</Button>
                </div>
                <div style={{ margin: '1em 0' }}>
                  <Button onClick={this.facebookSignup} type="primary" size="large" ghost block><Icon style={{ fontSize: 20 }} type="facebook" /> ลงทะเบียนโดย Facebook</Button>
                </div>
                <Divider>&</Divider>
                <Form className="login-form" onSubmit={this.handleSubmitForm}>
                  <FormItem
                    validateStatus={emailError ? 'error' : ''}
                    help={emailError || ''}
                  >
                    {getFieldDecorator('email', {
                      rules: [{
                        type: 'email', message: 'รูปแบบอีเมลล์ไม่ถูกต้อง',
                      }, {
                        required: true, message: 'กรุณาใส่อีเมลล์',
                      }],
                    })(
                      <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="email" size="large"
                        placeholder="episode@example.com"
                        onChange={this.handleEmailChange}
                      />
                    )}
                  </FormItem>
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
                        placeholder="password" size="large"
                        onChange={this.handlePasswordChange}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                  >
                    {getFieldDecorator('confirm', {
                      rules: [{ required: true },
                      {
                        validator: this.compareToFirstPassword,
                      }],
                    })(
                      <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Confirm Password"
                        size="large"
                        onBlur={this.handleConfirmBlur}
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    <Button loading={loading} disabled={this.hasErrors(getFieldsError())}
                      icon="login" htmlType="submit" type="primary" block size="large">ลงทะเบียน</Button>
                  </FormItem>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><span>หรือ </span><Link href="/sign-in" ><a>ล็อคอิน</a></Link></div>
                    <div><Icon type="home" theme="outlined" /> <Link href="/" ><a>กลับหน้าหลัก</a></Link></div>
                  </div>
                </Form>
              </div>
              <div className="col-md-8 banner-sec">
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Form.create()(Signup)