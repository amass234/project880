import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Divider, Button, Form, Input, Icon, Spin, Select, Modal, Slider, Radio } from 'antd'
import { Col, Row } from 'reactstrap'
import { css } from 'react-emotion'
import TagsInput from 'react-tagsinput'
import AvatarEditor from 'react-avatar-editor'
import Editor from 'react-medium-editor'
import LayoutMain from '../Main/LayoutMain'
import Firebase from '../../config/Firebase'
import { FormErrors } from '../FormError';
import Head from '../head';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SpinCostom = <div className="loading-spinner"></div>

const children = [
  <Option key={'กำลังภายใน'}>กำลังภายใน</Option>,
  <Option key={'แฟนตาซี'}>แฟนตาซี</Option>,
  <Option key={'รักโรเมนติก'}>รักโรเมนติก</Option>,
  <Option key={'ผจญภัย'}>ผจญภัย</Option>,
  <Option key={'เกมออนไลน์'}>เกมออนไลน์</Option>,
  <Option key={'สืบสวน'}>สืบสวน</Option>,
  <Option key={'ระทึกขวัญ'}>ระทึกขวัญ</Option>,
  <Option key={'คอมมาดี้'}>คอมมาดี้</Option>,
  <Option key={'ดราม่า'}>ดราม่า</Option>,
  <Option key={'เหนือธรรมาชาติ'}>เหนือธรรมาชาติ</Option>,
  <Option key={'ฮาเร็ม'}>ฮาเร็ม</Option>,
  <Option key={'รักเดียว'}>รักเดียว</Option>,
]

@inject('createStore', 'authStore')
@observer
export class EditorNovel extends Component {

  state = { authorId: '' }

  async componentDidMount() {
    await this.props.authStore.getUser()
    await this.props.createStore.reset()
    const { values } = this.props.createStore
    const id = this.props.id
    const itemsRef = Firebase.firestore().collection('novels');
    await itemsRef.doc(id).get().then((snapshot) => {
      let item = snapshot.data();
      values.title = item.title
      values.cover = item.cover
      values.description = item.description
      values.body = item.body
      values.tags = item.tags
      values.catalog = item.catalog
      values.rating = item.rating
      this.setState({ authorId: item.authorId })
      this.props.createStore.loading = false
    })
    this.props.createStore.width = 250
    this.props.createStore.height = 350
  }

  componentWillUnmount() {
    this.handleSubmit
  }

  handleSave = (data) => this.props.createStore.handleSave()
  setEditorRef = editor => this.props.createStore.setEditorRef(editor)
  handleScale = value => {
    const scale = parseFloat(value)
    this.props.createStore.scale = scale
  }

  handleTitleChange = (e) => this.props.createStore.setTitle(e.target.value);
  handleDescriptionChange = (e) => this.props.createStore.setDescription(e.target.value);
  handleCatalogChange = (catalog) => this.props.createStore.setCatalog(catalog);
  handleBodyChange = (body) => this.props.createStore.setBody(body);
  handleRatingChange = (rating) => this.props.createStore.setRating(rating);
  handleTagsChange = (tags) => this.props.createStore.setTags(tags);

  onSelectFile = (e) => this.props.createStore.onSelectFile(e.target.files)
  onSelectFileTwo = (e) => this.props.createStore.onSelectFileTwo(e.target.files)
  handlePreview = () => this.props.createStore.previewVisible = true
  handleSubmit = () => this.props.createStore.editorNovel(this.props.id)

  render() {
    const { user, uid } = this.props.authStore
    const { authorId } = this.state
    const { getFieldDecorator } = this.props.form
    const { previewSrc, values, preview, editor, scale, width, height, loading, formErrors, allowZoomOut, previewVisible } = this.props.createStore
    const uploadButton = (
      <div className="upload-btn-cover">
        <img src={values.cover || '/static/cover.png'} className="img-fluid" alt="Uploaded images" />
        <input type="file" onChange={this.onSelectFile} />
      </div>
    );
    return (
      <div>
        <Head title={`Editor - ${values.title} - Episode2`} />
        <LayoutMain>
          <Divider className={css({
            marginTop: '1em !important',
            fontFamily: '"PraJad", "PraJaditalic", "PraJad-bold", "PraJad-boldItalic"',
            fontSize: '25px !important',
          })}>แก้ไขนิยาย</Divider>
          {uid === authorId && user ?
            <Spin indicator={SpinCostom} size="large" spinning={loading} tip="Loading...">
              <Form className="login-form" >
                <FormErrors formErrors={formErrors} />
                <Row>
                  <Col sm="3" style={{ textAlign: 'center' }}>
                    <div>
                      {editor ?
                        <div className="cover-uploader">
                          <div className="upload-btn-cover" >
                            <div className="iconEdit">
                              <Icon type="edit" theme="filled" style={{ fontSize: 20, color: '#fff' }} />
                              <input type="file" onChange={this.onSelectFileTwo} />
                            </div>
                            <img src={preview.img || values.cover || '/static/cover.png'} onClick={this.handlePreview} className="img-fluid" alt="avatar" width='240' height='350' />
                          </div>
                        </div>
                        : uploadButton}
                    </div>
                    <div>
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
                              border={50}
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
                  <Col sm="9">
                    <FormItem>
                      <Input
                        name="title"
                        value={values.title}
                        type="text"
                        required
                        prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="ชื่อเรื่อง"
                        size="large"
                        onChange={this.handleTitleChange}
                      />
                    </FormItem>
                    <FormItem>
                      <TextArea
                        name="description"
                        required
                        value={values.description}
                        placeholder="คำโปรย"
                        autosize={{ minRows: 4, maxRows: 6 }}
                        onChange={this.handleDescriptionChange}
                      />
                    </FormItem>
                    <Row>
                      <Col sm="5">
                        <FormItem>
                          {getFieldDecorator(`catalog`, {
                            validateTrigger: ["onChange"],
                            initialValue: values.catalog || null,
                          })(
                            <Select
                              mode="multiple"
                              size='large'
                              placeholder="เลือกหมวดหมู่"
                              onChange={this.handleCatalogChange}
                              style={{ width: '100%' }}
                            >
                              {children}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col sm="5">
                        <FormItem>
                          {getFieldDecorator(`rating`, {
                            validateTrigger: ["onChange"],
                            initialValue: values.rating || null,
                          })(
                            <RadioGroup onChange={(e) => this.handleRatingChange(e.target.value)}>
                              <RadioButton value="ทั่วไป">ทั่วไป</RadioButton>
                              <RadioButton value="PG-13">PG-13</RadioButton>
                              <RadioButton value="PG-15">PG-15</RadioButton>
                              <RadioButton value="NC-18">NC-18</RadioButton>
                            </RadioGroup>
                          )}
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <FormItem>
                  <Editor
                    text={values.body}
                    onChange={this.handleBodyChange}
                    className={"ant-input editorP"}
                    options={{ toolbar: true, placeholder: { text: "" } }}
                  />
                </FormItem>
                <FormItem>
                  <label>กด Enter ทุกครั้งเมื่อพิมพ์เสร็จ</label>
                  <TagsInput className="ant-input" value={values.tags || ['']} onChange={this.handleTagsChange} />
                </FormItem>
                <FormItem>
                  <Button onClick={this.handleSubmit} loading={loading} size="large" icon="edit" type="default" htmlType="submit" className="login-form-button">
                    อัพเดท
                  </Button>
                </FormItem>
              </Form>
            </Spin> : <div />}
        </LayoutMain >
      </div>
    )
  }
}


export default Form.create()(EditorNovel)
