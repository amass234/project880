import React, { Component } from 'react'
import Link from 'next/link'
import { Avatar, Input, Form, Button, message, Icon, Divider, Tooltip } from 'antd'
import { Col, Row } from 'reactstrap'
import { inject, observer } from 'mobx-react';

const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@inject('commentStore', 'authStore')
@observer
export class CommentInput extends Component {

    componentDidMount() {
        this.props.form.validateFields();
        this.props.commentStore.reset();
        // this.props.form.setFieldsValue({
        //     comment: ""
        // })
    }

    haddleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error(err);
            }
        })
        const id = this.props.idNovel
        const idepisode = this.props.idEpisode
        this.props.commentStore.createComment(id, idepisode)
        this.props.form.setFieldsValue({
            comment: ""
        })
    }
    haddleChangComment = (e) => {
        this.props.commentStore.setComment(comment.value)
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const commentError = isFieldTouched('comment') && getFieldError('comment');
        const { comment, loadign } = this.props.commentStore
        return (
            <div>
                <Divider orientation="left" className='FonstPT'>
                    Comment
                </Divider>
                <Form onSubmit={this.haddleSubmit}>
                    <Row>
                        <Col sm="1">
                            <FormItem>
                                <Avatar size={50} src={this.props.avatar || '/static/user-no.png'} />
                            </FormItem>
                        </Col>
                        <Col sm="8">
                            <FormItem
                                validateStatus={commentError ? 'error' : ''}
                                help={commentError || ''}
                            >
                                {getFieldDecorator('comment', {
                                    rules: [{ required: true, message: ' ' }],
                                    initialValue: comment
                                })(
                                    <Input
                                        className="editorTitle editorComment"
                                        disabled={this.props.user ? false : true}
                                        size="large"
                                        prefix={<Icon type="message" style={{ marginLeft: 12, fontSize: 25, color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder={this.props.user ? "แสดงความคิดเห็น" : "เข้าสู่ระบบก่อนแสดงความคิดเห็น"}
                                        onChange={this.haddleChangComment}
                                    />
                                )}
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem style={{ float: 'right' }}>
                                <Tooltip placement="left" title="ใส่ข้อความอีกครั้งเป็นการแก้ไข หากใส่แล้วจะไม่สามารถลบได้ อยากใส่อีกครั้งรีโหลดหน้าใหม่">
                                    <Icon style={{ fontSize: 15, marginRight: 5 }} type="question-circle" theme="outlined" />
                                </Tooltip>
                                {this.props.user ? 
                                <Button
                                    icon="enter"
                                    ghost
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={loadign}
                                    disabled={hasErrors(getFieldsError())}
                                /> : 
                                <Button
                                    ghost
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                ><Link href='/sign-in'><a className='a'><Icon type='login' /></a></Link></Button>
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

export default Form.create()(CommentInput)
