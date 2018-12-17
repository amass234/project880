import {
    observable,
    action
} from 'mobx';
import Firebase from '../config/Firebase'
import Router from 'next/router'
import moment from 'moment'
import { Modal, message, notification, Progress } from 'antd'

const confirm = Modal.confirm;

let date = moment().format('YYYY-MM-DDTHH:mm:ss');
let time = moment().format("LT");

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

class CreateStore {

    @observable id = randomId;
    @observable name = randomname;
    @observable formValid = false;
    @observable titleValidate = false;
    @observable desValidate = false;
    @observable bodyValidate = false;
    @observable tagsValidate = false;
    @observable catalogValidate = false;
    @observable loading = true;
    @observable previewSrc = null;
    @observable showProgress = false;
    @observable progress = 0;
    @observable file = null;
    @observable previewVisible = true;
    @observable url = '';
    @observable disableEditing = false
    @observable width = 0;
    @observable height = 0;
    @observable scale = 1;
    @observable rect = 1;
    @observable allowZoomOut = false;

    @observable values = {
        cover: '/static/cover.png',
        body: '',
        title: '',
        description: '',
        tags: [],
        rating: 'ทั่วไป',
        catalog: [],
    };
    @observable formErrors = { title: '', des: '', cat: '', ret: '', body: '', tags: '' }

    @observable preview = {
        img: null,
        rect: null,
        scale: this.scale,
        width: this.width,
        height: this.height,
    }

    randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }

    @action reset() {
        this.editor = null
        this.id = this.randomString(10, '#')
        this.name = this.randomString(15, 'aA#')
        this.formValid = false;
        this.titleValidate = false;
        this.desValidate = false;
        this.bodyValidate = false;
        this.tagsValidate = false;
        this.catalogValidate = false;
        this.loading = true;
        this.previewSrc = '';
        this.progress = 0;
        this.previewVisible = true;
        this.url = '';
        this.values = {
            cover: '/static/cover.png',
            body: '',
            title: '',
            description: '',
            tags: [],
            rating: 'ทั่วไป',
            catalog: [],
        };
        this.preview = {
            img: '',
            rect: '',
            scale: this.scale,
            width: this.width,
            height: this.height,
        }
        this.disableEditing = false
    }


    @action handleSave = data => {
        const img = this.editor.getImageScaledToCanvas().toDataURL()
        const rect = this.editor.getCroppingRect()
        this.preview.img = img
        this.preview.rect = rect
        this.preview.scale = this.scale
        this.preview.width = this.width
        this.preview.height = this.height
        this.previewVisible = false
    };

    @action setEditorRef = editor => {
        if (editor) this.editor = editor
    }

    @action setBody(body) {
        this.values.body = body;
        this.bodyValidate = true
        this.validateField('body', body)
    }
    @action setTags(tags) {
        this.values.tags = tags;
        this.tagsValidate = true
        this.validateField('tags', tags)
    }
    @action setRating(rating) {
        this.values.rating = rating;
        this.ratingValidate = true
    }
    @action setTitle(title) {
        this.values.title = title;
        this.validateField('title', title)
    }
    @action setDescription(description) {
        this.values.description = description;
        this.validateField('description', description)
    }
    @action setCatalog(catalog) {
        this.values.catalog = catalog;
        this.catalogValidate = true
        this.validateField('catalog', catalog)
    }

    @action onSelectFile = files => {
        if (files && files.length > 0) {
            var file = files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                var img = document.createElement("img");
                img.onload = () => {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    var MAX_WIDTH = 1000;
                    var MAX_HEIGHT = 1000;
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
                    this.previewSrc = dataurl
                }
                img.src = e.target.result;
            }
            reader.addEventListener("load", () =>
                this.src = reader.result
            );
            reader.readAsDataURL(file);
        }
    };
    @action onSelectFileTwo = files => {
        if (files && files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                var img = document.createElement("img");
                img.onload = () => {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    var MAX_WIDTH = 1000;
                    var MAX_HEIGHT = 1000;
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
                    this.previewSrc = dataurl
                }
                img.src = e.target.result;
            }
            reader.addEventListener("load", () =>
                this.src = reader.result
            );
            reader.readAsDataURL(files[0]);
        }
        this.previewVisible = true
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.formErrors;
        switch (fieldName) {
            case 'title':
                this.titleValidate = value.length >= 1;
                fieldValidationErrors.title = this.titleValidate ? '' : 'ชื่อหนังสือจะต้องมีตั้งแต่ 1 ตัวอักษร แต่ไม่เกิน 80 ตัวอักษร';
                break;
            case 'description':
                this.desValidate = value.length >= 1;
                fieldValidationErrors.des = this.desValidate ? '' : 'คำโปรยจะต้องมีตั้งแต่ 1 ตัวอักษร แต่ไม่เกิน 500 ตัวอักษร';
                break;
            case 'catalog':
                this.catalogValidate = value.length >= 1;
                fieldValidationErrors.cat = this.catalogValidate ? '' : 'กรุณาเลือกหมวดหนังสืออย่างน้อย 1 หมวด';
                break;
            case 'tags':
                this.tagsValidate = value.length >= 1;
                fieldValidationErrors.tags = this.tagsValidate ? '' : 'กรุณาเลือกแท็คหนังสืออย่างน้อย 1 แท็ค';
                break;
            case 'body':
                this.bodyValidate = value.length >= 12;
                fieldValidationErrors.body = this.bodyValidate ? '' : 'บทนำจะต้องมีตั้งแต่ 5 ตัวอักษร แต่ไม่เกิน 5000 ตัวอักษร';
                break;
            default:
                break;
        }
        this.formErrors = fieldValidationErrors
        this.titleValidate = this.titleValidate
        this.desValidate = this.desValidate
        this.bodyValidate = this.bodyValidate
        this.tagsValidate = this.tagsValidate
        this.catalogValidate = this.catalogValidate
        this.formValid =
            this.titleValidate
            && this.desValidate
            && this.bodyValidate
            && this.tagsValidate
            && this.catalogValidate
    }

    @action showConfirm() {
        const _this = this
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                confirm({
                    title: `สร้างนิยาย ${this.values.title}`,
                    content:
                        <div>
                            <p>ผู้เขียน: {user.displayName}</p>
                            <p>รายละเอียด: {this.values.description}</p>
                            <p>หมวดหมู่: {this.values.catalog.map((catalog) => <span style={{ marginLeft: 10 }}>{catalog}</span>)}</p>
                            <p>เรท: {this.values.rating}</p>
                            <p>แท็ค: {this.values.tags.map((tags) => <span style={{ marginLeft: 10 }}>{tags}</span>)}</p>
                        </div>
                    ,
                    okText: 'สร้างนิยาย',
                    cancelText: 'แก้ไข',
                    onOk() {
                        return new Promise((resolve, reject) => {
                            setTimeout(5 ? resolve : reject, 1000);
                            _this.createNovel()
                        }).catch((err) => console.log(err));
                    },
                    onCancel() { return _this.loading = false },
                });
            }
        })
    }

    @action openNotification = (progress) => {
        message.loading(`กำลังสร้างนิยาย..${progress}%`)
    };

    createNovel = () => {
        const file = this.editor;
        this.loading = true
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let dbCloud = Firebase.firestore().collection('novels');
                let dbUser = Firebase.firestore().collection('users');
                if (file) {
                    this.showProgress = true
                    const uploadTask = Firebase.storage().ref('images/')
                    uploadTask.child(`${this.name}`).putString(this.preview.img, 'data_url').on('state_changed',
                        (snapshot) => {
                            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            this.openNotification(progress)
                        },
                        (error) => {
                            console.log(error);
                            message.error(error)
                        },
                        () => {
                            Firebase.storage().ref('images').child(`${this.name}`).getDownloadURL()
                                .then(url => {
                                    dbCloud.doc(this.id).set({
                                        authorId: user.uid,
                                        body: this.values.body,
                                        title: this.values.title,
                                        description: this.values.description,
                                        tags: this.values.tags,
                                        author: user.displayName,
                                        avatar: user.photoURL,
                                        rating: this.values.rating,
                                        catalog: this.values.catalog,
                                        cover: url,
                                        episodecount: 0,
                                        createDate: `${date}`,
                                        createTime: `${time}`,
                                        endNovel: false,
                                    }).then(() => Router.replace(`/novel?id=${this.id}`, `/novel-${this.id}`), this.loading = false, this.showProgress = false)
                                })
                        }
                    )

                } else {
                    dbCloud.doc(this.id).set({
                        authorId: user.uid,
                        body: this.values.body,
                        title: this.values.title,
                        description: this.values.description,
                        tags: this.values.tags,
                        rating: this.values.rating,
                        catalog: this.values.catalog,
                        cover: this.values.cover,
                        createDate: `${date}`,
                        createTime: `${time}`,
                        episodecount: 0,
                        endNovel: false,
                    }).then(() => Router.replace(`/novel?id=${this.id}`, `/novel-${this.id}`), this.loading = false)
                }
            }
        })
    }

    @action editorNovel = (id) => {
        this.loading = true
        const file = this.editor
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let dbCloud = Firebase.firestore().collection('novels')
                let dbUser = Firebase.firestore().collection('users');
                if (file) {
                    const uploadTask = Firebase.storage().ref('images/')
                    uploadTask.child(`${this.name}`).putString(this.preview.img, 'data_url').on('state_changed',
                        (snapshot) => {
                            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            this.progress = progress
                        },
                        (error) => {
                            console.log(error);
                            message.error(error)
                        },
                        () => {
                            Firebase.storage().ref('images').child(`${this.name}`).getDownloadURL().then(url => {
                                dbCloud.doc(id).update({
                                    authorId: user.uid,
                                    body: this.values.body,
                                    title: this.values.title,
                                    description: this.values.description,
                                    tags: this.values.tags,
                                    rating: this.values.rating,
                                    catalog: this.values.catalog,
                                    cover: url,
                                    updateDate: date,
                                })
                                    .catch((error) => { this.loading = false, message.error(error) })
                                    .then(() => Router.replace(`/novel?id=${id}`, `/novel-${id}`))
                            })
                        })
                } else {
                    dbCloud.doc(id).update({
                        authorId: user.uid,
                        body: this.values.body,
                        title: this.values.title,
                        description: this.values.description,
                        tags: this.values.tags,
                        rating: this.values.rating,
                        catalog: this.values.catalog,
                        cover: this.values.cover,
                        updateDate: date,
                    })
                        .catch((error) => { this.loading = false, message.error(error) })
                        .then(() => Router.replace(`/novel?id=${id}`, `/novel-${id}`))
                }
            }
        })
    }


}



export default new CreateStore();