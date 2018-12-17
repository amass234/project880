import React, { Component } from 'react'
import { Form, Icon, Input, Button, Tooltip, DatePicker, Spin, Modal, Slider } from 'antd'
import { Col, Row } from 'reactstrap'
import { inject, observer } from 'mobx-react';
import moment from 'moment'
import { css } from 'react-emotion'
import AvatarEditor from 'react-avatar-editor'

const FormItem = Form.Item;

const SpinCostom = <div className="loading-spinner"></div>

@inject('createStore', 'profileStore')
@observer
export class ProfileSetting extends Component {

    async componentDidMount() {
        await this.props.createStore.reset()
        await this.props.profileStore.getProfile()
        this.props.profileStore.loading = false
        this.props.createStore.width = 250
        this.props.createStore.height = 250
    }

    handleUsernameChang = () => this.props.profileStore.setUser(username.value)
    handleFirstnameChang = () => this.props.profileStore.setFirstname(firstname.value)
    handleLastnameChang = () => this.props.profileStore.setLastname(lastname.value)
    handleBirthdateChang = (date, dateString) => this.props.profileStore.serBirthdate(dateString)
    handleTelChang = () => this.props.profileStore.setTel(tel.value)

    handleSave = (data) => this.props.createStore.handleSave()
    setEditorRef = editor => this.props.createStore.setEditorRef(editor)
    handleScale = value => {
        const scale = parseFloat(value)
        this.props.createStore.scale = scale
    }

    onSelectFile = (e) => this.props.createStore.onSelectFile(e.target.files)
    onSelectFileTwo = (e) => this.props.createStore.onSelectFileTwo(e.target.files)
    handleCancel = () => this.props.createStore.previewVisible = false
    handlePreview = () => this.props.createStore.previewVisible = true

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
            if (!err) {
                const file = this.props.createStore.editor
                const name = this.props.createStore.name
                const img = this.props.createStore.preview.img
                this.props.profileStore.profileUpdate(file, name, img)
            }
        });
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 6 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 },
            },
        };
        const { previewSrc, preview, scale, width, height, allowZoomOut, editor, previewVisible } = this.props.createStore
        const { username, firstname, avatar, lastname, birthdate, tel, loading, spinning } = this.props.profileStore
        const { getFieldDecorator } = this.props.form;
        const uploadButton = (
            <div className="upload-btn-wrapper">
                <img src={avatar || '/static/user-no.png'} className="img-fluid" alt="Uploaded images" style={{ borderRadius: '50%' }} />
                <input type="file" onChange={this.onSelectFile} />
            </div>
        );
        return (
            <div>
                <Spin indicator={SpinCostom} size="large" spinning={spinning}>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Row>
                            <Col className="flex-center" sm="4">
                                <div>
                                    <div className="avatar-uploader">
                                        {editor ?
                                            <div className="upload-btn-wrapper">
                                                <div className="iconEdit">
                                                    <Icon type="edit" theme="filled" style={{ fontSize: 20, color: '#fff' }} />
                                                    <input type="file" onChange={this.onSelectFileTwo} />
                                                </div>
                                                <img src={preview.img} onClick={this.handlePreview} className="img-fluid" alt="avatar" width='250' style={{ borderRadius: '50%' }} />
                                            </div>
                                            : uploadButton}
                                    </div>
                                    {!!previewSrc && (
                                        <Modal style={{ top: 20 }}
                                            visible={previewVisible}
                                            footer={null}
                                            closable={false}
                                        >
                                            <div className='ImageCrop'>
                                                <AvatarEditor
                                                    ref={this.setEditorRef}
                                                    image={previewSrc}
                                                    width={width}
                                                    height={height}
                                                    borderRadius={250}
                                                    color={[0, 0, 0, 0.65]} // RGBA
                                                    scale={1}
                                                    rotate={0}
                                                    scale={parseFloat(scale)}
                                                    className="img-fluid"
                                                />
                                                <h6>
                                                    Zoom:
                                                    <Slider
                                                        className={css({ maxWidth: 350 })}
                                                        onChange={this.handleScale}
                                                        min={allowZoomOut ? 0.1 : 1}
                                                        max={2}
                                                        step={0.01}
                                                        defaultValue={1}
                                                    />
                                                </h6>
                                                <Button className={css({ float: 'right' })} size='large' type="primary" onClick={this.handleSave} icon="scissor" />
                                            </div>
                                        </Modal>
                                    )}
                                </div>
                            </Col>
                            <Col sm="8" style={{ borderLeft: '1px solid #e8e8e8' }}>
                                <FormItem
                                    {...formItemLayout}
                                    label={(
                                        <span>
                                            <Tooltip placement="left" title="What do you want others to call you?">
                                                ชื่อผู้เขียน <Icon type="question-circle-o" />
                                            </Tooltip>
                                        </span>
                                    )}
                                >
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: 'ใส่ชื่อผู้เขียน' }],
                                        initialValue: username
                                    })(
                                        <Input
                                            size="large"
                                            onChange={this.handleUsernameChang}
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="Username" />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="ชื่อ - สกุล">
                                    <Row>
                                        <Col sm="6">
                                            <FormItem>
                                                {getFieldDecorator('firstname', {
                                                    rules: [{ required: true, message: 'ใส่ชื่อต้น' }],
                                                    initialValue: firstname
                                                })(
                                                    <Input
                                                        required
                                                        size="large"
                                                        onChange={this.handleFirstnameChang}
                                                        placeholder="ชื่อ"
                                                    />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col sm="6">
                                            <FormItem>
                                                {getFieldDecorator('lastname', {
                                                    rules: [{ required: true, message: 'ใส่นามสกุล' }],
                                                    initialValue: lastname
                                                })(
                                                    <Input
                                                        required
                                                        onChange={this.handleLastnameChang}
                                                        size="large"
                                                        placeholder="นามสกุล" />
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="วันเกิด"
                                >
                                    {getFieldDecorator('birthdate', {
                                        rules: [{ type: 'object', required: true, message: 'เลือกวันเกิด' }],
                                        initialValue: birthdate ? moment(`${birthdate}`, 'YYYY-MM-DD') : null
                                    })(
                                        <DatePicker
                                            size="large"
                                            onChange={this.handleBirthdateChang}
                                        />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="เบอร์โทรศัพท์">
                                    {getFieldDecorator('tel', {
                                        rules: [{ required: true, message: 'ใส่เบอร์โทรศัพท์' }],
                                        initialValue: tel
                                    })(
                                        <Input size="large" onChange={this.handleTelChang} />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button
                                        loading={loading}
                                        size="large"
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button">
                                        อัพเดท</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </div>
        )
    }
}

export default Form.create()(ProfileSetting)
