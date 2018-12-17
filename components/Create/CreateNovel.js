import React, { Component } from 'react'
import { Tabs, Button, Icon, Form, Input, Modal, Select, Slider, Radio, Tooltip } from 'antd'
import { Col, Row } from 'reactstrap'
import TagsInput from 'react-tagsinput'
import { css } from 'react-emotion'
import { inject, observer } from 'mobx-react';
import Editor from 'react-medium-editor'
import AvatarEditor from 'react-avatar-editor'

import LayoutMain from '../Main/LayoutMain'
import { FormErrors } from '../FormError';

const { TextArea } = Input;
const FormItem = Form.Item
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

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

@inject('createStore')
@observer
export class CreateNovel extends Component {

  async componentDidMount() {
    await this.props.createStore.reset()
    this.props.createStore.loading = false
    this.props.createStore.width = 250
    this.props.createStore.height = 350
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
  handleSubmit = () => this.props.createStore.showConfirm()

  render() {
    const { previewSrc, values, preview, scale, width, editor, loading, height, formErrors, formValid, allowZoomOut, previewVisible } = this.props.createStore
    const uploadButton = (
      <div className="upload-btn-cover">
        <img src={values.cover || '/static/user-no.png'} className="img-fluid" alt="Uploaded images" />
        <input type="file" onChange={this.onSelectFile} />
      </div>
    );
    return (
      <Form className="login-form">
        <div className="NCardbgCoverOverlay">
          <LayoutMain>
            <Row>
              <Col sm="3" style={{ textAlign: 'center' }}>
                <div>
                  <div className="cover-uploader">
                    {editor ?
                      <div className="upload-btn-cover" >
                        <div className="iconEdit">
                          <Icon type="edit" theme="filled" style={{ fontSize: 20, color: '#fff' }} />
                          <input type="file" onChange={this.onSelectFileTwo} />
                        </div>
                        <img src={preview.img || '/static/cover.png'} onClick={this.handlePreview} className="img-fluid" alt="avatar" width='240' height='350' />
                      </div>
                      : uploadButton
                    }
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
                <FormErrors formErrors={formErrors} />
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
                    style={{ fontSize: 18 }}
                    value={values.description}
                    placeholder="คำโปรย"
                    autosize={{ minRows: 4, maxRows: 6 }}
                    onChange={this.handleDescriptionChange}
                  />
                </FormItem>
                <FormItem>
                  <Row>
                    <Col style={{ marginBottom: '1em' }}>
                      <Select
                        mode="multiple"
                        size='large'
                        placeholder="เลือกหมวดหมู่"
                        onChange={this.handleCatalogChange}
                        style={{ width: '100%' }}
                      >
                        {children}
                      </Select>
                    </Col>
                    <Col>
                      <RadioGroup defaultValue="ทั่วไป" onChange={(e) => this.handleRatingChange(e.target.value)}>
                        <RadioButton value="ทั่วไป">ทั่วไป</RadioButton>
                        <RadioButton value="PG-13">PG-13</RadioButton>
                        <RadioButton value="PG-15">PG-15</RadioButton>
                        <RadioButton value="NC-18">NC-18</RadioButton>
                      </RadioGroup>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem>
                  <label>กด Enter ทุกครั้งเมื่อพิมพ์เสร็จ</label>
                  <Tooltip title='พยามอย่าใช้ช่องว่างในแท็กเช่น episode2 tags ควรเป็น episode2Tags'>
                    <Icon style={{ marginLeft: 10 }} type="question-circle" />
                  </Tooltip>
                  <TagsInput className="ant-input" value={values.tags} onChange={this.handleTagsChange} />
                </FormItem>
              </Col>
            </Row>
          </LayoutMain >
        </div>
        <LayoutMain>
          <FormItem>
            <Tabs defaultActiveKey="1">
              <TabPane style={{ padding: '0 0 2em 0' }} tab={<span style={{ fontSize: 20 }}><Icon type="file-text" theme="outlined" />บทนำ</span>} key="1">
                <Editor
                  text={values.body}
                  onChange={this.handleBodyChange}
                  className={"ant-input"}
                  options={{ toolbar: true, placeholder: { text: "บทนำ" } }}
                />
              </TabPane>
            </Tabs>
          </FormItem>
          <FormItem>
            <Button loading={loading} onClick={this.handleSubmit} disabled={!formValid} size="large" icon="edit" type="primary" htmlType="submit" className="login-form-button">
              สร้างนิยาย
              </Button>
          </FormItem>
        </LayoutMain>
      </Form>
    )
  }
}


export default CreateNovel
