import React, { Component } from 'react'
import { Form, Icon, Input, Divider } from 'antd';
import { inject, observer } from 'mobx-react';
import EditorEpisode from '../Editor/EditorEpisode'
import LayoutMain from '../Main/LayoutMain'
import HeaderNew from './HeaderNew'

const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@inject('createEpisode')
@observer
export class CreateEpisode extends Component {

    async componentDidMount() {
       await this.props.createEpisode.reset()
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const id = this.props.id
        this.props.createEpisode.create(id)
    }

    handleTitleChange = () => this.props.createEpisode.setTitle(title.value)
    handleChange = (body) => this.props.createEpisode.setBody(body)

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        // Only show error after a field is touched.
        const userNameError = isFieldTouched('title') && getFieldError('title');
        const { loading, body } = this.props.createEpisode
        return (
            <Form onSubmit={this.handleSubmit}>
                <HeaderNew disabled={hasErrors(getFieldsError())} id={this.props.id} loading={loading} />
                <LayoutMain>
                    <div className='layoutEpisode' style={{ marginTop: '11em' }}>
                        <FormItem
                            validateStatus={userNameError ? 'error' : ''}
                            help={userNameError || ''}
                        >
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: 'ใส่ชื่อตอน' }]
                            })(
                                <Input
                                    className="editorTitle"
                                    size="large"
                                    prefix={<Icon type="minus" style={{ marginLeft: -12, fontSize: 25, color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="ชื่อตอน"
                                    onChange={this.handleTitleChange}
                                />
                            )}
                        </FormItem>
                        <Divider />
                        <FormItem style={{ paddingBottom: '2em' }}>
                            <EditorEpisode handleChange={this.handleChange} body={body} />
                        </FormItem>
                    </div>
                </LayoutMain>
            </Form>
        )
    }
}

export default Form.create()(CreateEpisode)
