import React, { Component } from 'react'
import Router from 'next/router'
import moment from 'moment'
import { Divider, Button, Icon, Form, Input, Modal, Select } from 'antd'
import { Col, Row } from 'reactstrap'
import TagsInput from 'react-tagsinput'
import { Button as ButtonR, ButtonGroup as ButtonG, } from 'reactstrap';
import ReactCrop from "react-image-crop";
import EditorConvertToJSON from './EditorConvertToJSON'
import LayoutMain from '../Main/LayoutMain'
import Firebase from '../../config/Firebase'
import { FormErrors } from '../FormError';

const { TextArea } = Input;
const FormItem = Form.Item
const confirm = Modal.confirm;
const Option = Select.Option;

function randomString(length, chars) {
  var mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  var result = '';
  for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
  return result;
}

const randomId = randomString(10, '#')
const randomname = randomString(15, 'aA#')

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

export class CreateNovel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: randomId,
      name: randomname,
      cover: '/static/cover.png',
      body: '<p><br></p>',
      title: '',
      description: '',
      tags: [],
      rating: 'ทั่วไป',
      catalog: [1],
      formErrors: { title: '', des: '', cat: '', ret: '', body: '', tags: '' },
      formValid: false,
      titleValidate: false,
      desValidate: false,
      bodyValidate: false,
      tagsValidate: false,
      catalogValidate: false,
      loading: true,
      previewSrc: null,
      progress: 0,
      file: null,
      previewVisible: true,
      url: '',
      crop: {
        x: 10,
        y: 10,
        aspect: 9 / 13,
        height: 350,
      },
    }
  }

 

  handleChange = (body) => {
    const name = 'body'
    const value = body
    this.setState({
      body: body,
    },
      () => { this.validateField(name, value) });
  }

  handleChangeTags = (tags) => {
    const name = 'tags'
    const value = tags
    this.setState({ tags, tagsValidate: true }, () => this.validateField(name, value))
  }

  onRadioBtnClick(rating) {
    this.setState({ rating, ratingValidate: true });
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value },
      () => { this.validateField(name, value) });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;

    switch (fieldName) {
      case 'title':
        this.state.titleValidate = value.length >= 1;
        fieldValidationErrors.title = this.state.titleValidate ? '' : 'ชื่อหนังสือจะต้องมีตั้งแต่ 1 ตัวอักษร แต่ไม่เกิน 80 ตัวอักษร';
        break;
      case 'description':
        this.state.desValidate = value.length >= 1;
        fieldValidationErrors.des = this.state.desValidate ? '' : 'คำโปรยจะต้องมีตั้งแต่ 1 ตัวอักษร แต่ไม่เกิน 500 ตัวอักษร';
        break;
      case 'catalog':
        this.state.catalogValidate = value.length >= 1;
        fieldValidationErrors.cat = this.state.catalogValidate ? '' : 'กรุณาเลือกหมวดหนังสืออย่างน้อย 1 หมวด';
        break;
      case 'tags':
        this.state.tagsValidate = value.length >= 1;
        fieldValidationErrors.tags = this.state.tagsValidate ? '' : 'กรุณาเลือกแท็คหนังสืออย่างน้อย 1 แท็ค';
        break;
      case 'body':
        this.state.bodyValidate = value.length >= 12;
        fieldValidationErrors.body = this.state.bodyValidate ? '' : 'บทนำจะต้องมีตั้งแต่ 5 ตัวอักษร แต่ไม่เกิน 5000 ตัวอักษร';
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      titleValidate: this.state.titleValidate,
      desValidate: this.state.desValidate,
      bodyValidate: this.state.bodyValidate,
      tagsValidate: this.state.tagsValidate,
      catalogValidate: this.state.catalogValidate
    }, this.validateForm);
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.titleValidate
        && this.state.desValidate
        && this.state.bodyValidate
        && this.state.tagsValidate
        && this.state.catalogValidate
    })
  }

  catalogChang = (value) => {
    const name = 'catalog'
    this.setState({ catalog: value, catalogValidate: true }, () => this.validateField(name, value))
  }

  // Cover Upload ///
  handleCancel = () => this.setState({ previewVisible: false })
  
  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      var file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        var img = document.createElement("img");
        img.onload = () => {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          var MAX_WIDTH = 500;
          var MAX_HEIGHT = 500;
          var width = img.width;
          var height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          var dataurl = canvas.toDataURL("image/jpg");
          this.setState({ previewSrc: dataurl });
        }
        img.src = e.target.result;
      }
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(file);
    }
  };
  onSelectFileTwo = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        var img = document.createElement("img");
        img.onload = () => {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          var MAX_WIDTH = 500;
          var MAX_HEIGHT = 500;
          var width = img.width;
          var height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          var dataurl = canvas.toDataURL("image/jpg");
          this.setState({ previewSrc: dataurl });
        }
        img.src = e.target.result;
      }
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
    this.setState({ previewVisible: true })
  };
  onImageLoaded = (image, pixelCrop) => {
    this.imageRef = image;
  };

  onCropComplete = async (crop, pixelCrop) => {
    const croppedImageUrl = await this.getCroppedImg(
      this.imageRef,
      pixelCrop,
      `${this.state.name}.jpeg`
    );
    this.setState({ croppedImageUrl });
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(file);
        resolve(this.fileUrl);
        this.setState({ file })
      }, "image/jpeg");
    })
  }

  handlePreview = () => {
    this.setState({
      previewVisible: true,
    });
  }

  handleSubmit = () => {
    let date = moment().format('YYYY-MM-DDTHH:mm:ss');
    let time = moment().format("LT");
    let user = Firebase.auth().currentUser
    let dbCon = Firebase.database().ref('novel');
    let dbUser = Firebase.database().ref('users/' + user.uid + '/novelList');
    const { file } = this.state;
    if (file) {
      const uploadTask = Firebase.storage().ref(`images/${file.name}`).put(file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          this.setState({ progress });
        },
        (error) => {
          console.log(error);
        },
        () => {
          Firebase.storage().ref('images').child(file.name).getDownloadURL().then(url => {
            dbCon.child(this.state.id).set({
              authorId: user.uid,
              body: this.state.body,
              title: this.state.title,
              description: this.state.description,
              tags: this.state.tags,
              author: user.displayName,
              avatar: user.photoURL,
              rating: this.state.rating,
              catalog: this.state.catalog,
              cover: url,
              createDate: `${date}`,
              createTime: `${time}`,
            })
            dbUser.child(this.state.id)
              .set({
                id: this.state.id,
                body: this.state.body,
                title: this.state.title,
                cover: url,
                author: user.displayName,
                avatar: user.photoURL,
              })
              .then(() => Router.replace(`/novel?id=${this.state.id}`,`/n/${this.state.id}`))
          })
        })
    } else {
      dbCon.child(this.state.id).set({
        authorId: user.uid,
        body: this.state.body,
        title: this.state.title,
        description: this.state.description,
        tags: this.state.tags,
        author: user.displayName,
        avatar: user.photoURL,
        rating: this.state.rating,
        catalog: this.state.catalog,
        cover: this.state.cover,
        createDate: `${date}`,
        createTime: `${time}`,
      })
      dbUser.child(this.state.id)
        .set({
          id: this.state.id,
          body: this.state.body,
          title: this.state.title,
          cover: this.state.cover,
          author: user.displayName,
          avatar: user.photoURL,
        })
        .then(() => Router.replace(`/n/${this.state.id}`))
    }
  }


  // End Upload ///

  render() {
    const { croppedImageUrl } = this.state;
    const uploadButton = (
      <div className="upload-btn-cover">
        <img src={this.state.avatar || '/static/cover.png'} className="img-fluid" alt="Uploaded images" />
        <input type="file" onChange={this.onSelectFile} />
      </div>
    );
    return (
      <LayoutMain>
        <Divider style={Styles.FonstPT}>สร้างนิยาย</Divider>
        <Form className="login-form">
          <Row>
            <Col sm="3" style={{ textAlign: 'center'}}>
              <div>
                <div className="cover-uploader">
                  {croppedImageUrl ?
                    <div className="upload-btn-cover" >
                      <div className="iconEdit">
                        <Icon type="edit" theme="filled" style={{ fontSize: 20, color: '#fff' }} />
                        <input type="file" onChange={this.onSelectFileTwo} />
                      </div>
                      <img src={croppedImageUrl} onClick={this.handlePreview} className="img-fluid" alt="avatar" width='240' height='350' />
                    </div>
                    : uploadButton}
                </div>
                {this.state.previewSrc && (
                  <Modal style={{ top: 20 }} visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <ReactCrop
                      src={this.state.previewSrc}
                      crop={this.state.crop}
                      onImageLoaded={this.onImageLoaded}
                      onComplete={this.onCropComplete}
                      onChange={this.onCropChange}
                    />
                  </Modal>
                )}
              </div>
            </Col>
            <Col sm="9">
              <FormErrors formErrors={this.state.formErrors} />
              <FormItem>
                < Input
                  name="title"
                  value={this.state.title}
                  type="text"
                  required
                  prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="ชื่อเรื่อง"
                  size="large"
                  onChange={this.handleUserInput}
                />
              </FormItem>
              <FormItem>
                <TextArea
                  name="description"
                  required
                  style={{ fontSize: 18 }}
                  value={this.state.description}
                  placeholder="คำโปรย"
                  autosize={{ minRows: 4, maxRows: 6 }}
                  onChange={this.handleUserInput}
                />
              </FormItem>
              <FormItem>
                <Row>
                  <Col sm="4" style={{ marginBottom: '1em' }}>
                    <Select
                      mode="multiple"
                      size='large'
                      placeholder="เลือกหมวดหมู่"
                      onChange={this.catalogChang}
                      style={{ width: '100%' }}
                    >
                      {children}
                    </Select>
                  </Col>
                  <Col sm="5">
                    <ButtonG>
                      <ButtonR outline color="primary" onClick={() => this.onRadioBtnClick('ทั่วไป')} active={this.state.rating === 'ทั่วไป'}>ทั่วไป</ButtonR>
                      <ButtonR outline color="primary" onClick={() => this.onRadioBtnClick('PG-13')} active={this.state.rating === 'PG-13'}>PG-13</ButtonR>
                      <ButtonR outline color="primary" onClick={() => this.onRadioBtnClick('PG-15')} active={this.state.rating === 'PG-15'}>PG-15</ButtonR>
                      <ButtonR outline color="primary" onClick={() => this.onRadioBtnClick('NC-18')} active={this.state.rating === 'NC-18'}>NC-18</ButtonR>
                    </ButtonG>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <EditorConvertToJSON name="body" body={this.state.body} handleChange={this.handleChange} />
              </FormItem>
              <FormItem>
                <label>กด Enter ทุกครั้งเมื่อพิมพ์เสร็จ</label>
                <TagsInput className="ant-input" value={this.state.tags} onChange={this.handleChangeTags} />
              </FormItem>
              <FormItem>
                <Button onClick={this.showConfirm} disabled={!this.state.formValid} size="large" icon="edit" type="primary" htmlType="submit" className="login-form-button">
                  สร้างนิยาย
            </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </LayoutMain >
    )
  }
}

const Styles = {
  FonstP: {
    marginTop: '2em',
    marginBottom: '5em',
    fontFamily: '"PraJad", "PraJaditalic", "PraJad-bold", "PraJad-boldItalic"',
    fontSize: 18,
  },
  FonstPT: {
    marginTop: '1em',
    fontFamily: '"PraJad", "PraJaditalic", "PraJad-bold", "PraJad-boldItalic"',
    fontSize: 25,
  },
  box: {
    width: 240,
    height: 349,
    background: '#444',
    margin: 'auto',
    marginBottom: '1em'
  }
}
export default CreateNovel
