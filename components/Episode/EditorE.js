import React, { Component } from 'react'
import { Form, Icon, Input, Divider } from 'antd';
import { inject, observer } from 'mobx-react';
import Editor from 'react-medium-editor'
import LayoutMain from '../Main/LayoutMain'
import HeaderNew from './HeaderNew'
import Head from '../head';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@inject('createEpisode')
@observer
export class EditorE extends Component {

    async componentDidMount() {
        await this.props.createEpisode.reset()
        this.props.createEpisode.id = this.props.idNovel
        const id = this.props.idNovel
        const idepisode = this.props.idEpisode
        await this.props.form.validateFields();
        await this.props.createEpisode.episodeBody(id, idepisode)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const id = this.props.idNovel
        const idepisode = this.props.idEpisode
        this.props.createEpisode.updateEpisode(id, idepisode)
    }

    handleTitleChange = e => this.props.createEpisode.setTitle(e.target.value)
    handleChange = (body) => this.props.createEpisode.setBody(body)

    render() {

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, setFieldsValue } = this.props.form;
        const userNameError = isFieldTouched('title') && getFieldError('title');
        const { id, loading, title, body } = this.props.createEpisode
        return (
            <div>
                <Head title={`Edit - ${title} - Episode2`} />
                <Form onSubmit={this.handleSubmit}>
                    <HeaderNew disabled={hasErrors(getFieldsError())} id={this.props.idNovel} loading={loading} />
                    <LayoutMain>
                        <div style={{ marginTop: '11em' }}>
                            <FormItem
                                validateStatus={userNameError ? 'error' : ''}
                                help={userNameError || ''}

                            >
                                <Input
                                    className="editorTitle"
                                    size="large"
                                    prefix={<Icon type="minus" style={{ marginLeft: -12, fontSize: 25, color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="ชื่อตอน"
                                    value={title}
                                    onChange={this.handleTitleChange}
                                />
                            </FormItem>
                            <Divider />
                            <FormItem style={{ paddingBottom: '2em' }}>
                                <Editor
                                    text={body}
                                    onChange={this.handleChange}
                                    className="editor"
                                    options={{
                                        placeholder: { text: "" },
                                        toolbar: { buttons: ['bold', 'italic', 'underline'] },
                                    }}
                                />
                            </FormItem>
                        </div>
                    </LayoutMain>
                </Form>
            </div>
        )
    }
}

export default Form.create()(EditorE)
