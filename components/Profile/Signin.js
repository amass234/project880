import React, { Component } from 'react';
import Link from 'next/link'
import { inject, observer } from 'mobx-react';
import { Button, Input, Form, Icon, Modal, Divider } from 'antd';
import Head from '../head'


const FormItem = Form.Item
const confirm = Modal.confirm;

const ForgetInput = (
	<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
		type="emain"
		placeholder="Emain" size="large" />
)

@inject('authStore')
@observer
class Signin extends Component {

	componentDidMount() {
		this.props.form.validateFields();
	}

	handleEmailChange = () => this.props.authStore.setEmail(email.value);
	handlePasswordChange = () => this.props.authStore.setPassword(password.value);

	handleSubmitForm = (e) => {
		e.preventDefault();
		this.props.authStore.login()
	};
	showConfirm = () => {
		confirm({
			title: 'ใส่อีเมลล์เพื่อกู้รหัสผ่าน',
			content: ForgetInput,
			onOk() {
				return new Promise((resolve, reject) => {
					setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
				}).catch(() => console.log('Oops errors!'));
			},
			onCancel() { },
		})
	}
	hasErrors = (fieldsError) => {
		return Object.keys(fieldsError).some(field => fieldsError[field]);
	}
	facebookSignIn = () => this.props.authStore.facebookSignIn()
	googleSignin = () => this.props.authStore.googleSignin()

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
							<div className="col-md-4 login-sec signup-sec">
								<h2 className="text-right"><Icon type="lock" theme="outlined" /> ล็อคอิน</h2>
								<div style={{ margin: '1em 0' }}>
									<Button onClick={this.googleSignin} type="danger" size="large" block ghost><Icon style={{ fontSize: 20 }} type="google" /> ลงชื่อเข้าใช้โดย Google</Button>
								</div>
								<div style={{ margin: '1em 0' }}>
									<Button onClick={this.facebookSignIn} type="primary" size="large" ghost block><Icon style={{ fontSize: 20 }} type="facebook" /> ลงชื่อเข้าใช้โดย Facebook</Button>
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
									<FormItem>
										<Button disabled={this.hasErrors(getFieldsError())}
											loading={loading} icon="login" htmlType="submit" type="primary" block size="large">ล็อคอิน</Button>
									</FormItem>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<div ><a href="#" onClick={this.showConfirm}>ลืมรหัสผ่าน </a><span>หรือ </span><Link href="/sign-up" ><a>ลงทะเบียน</a></Link></div>
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

export default Form.create()(Signin);