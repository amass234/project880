import React, { PureComponent } from "react";
import { message, Modal, Icon } from 'antd';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Firebase from '../../config/Firebase'


function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}
function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

const randomname = randomString(15, '#aA')

class AvatarUpload extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            name: randomname,
            avatar: '',
            src: null,
            progress: 0,
            file: null,
            crop: {
                x: 10,
                y: 10,
                aspect: 1,
                height: 80
            },
            previewVisible: true,
        }
        this.handleUpload = this.handleUpload.bind(this);
    }

    componentDidMount() {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let dbUser = Firebase.database().ref('users');
                dbUser.child(user.uid).on('value', (snapshot) => {
                    let item = snapshot.val();
                    this.setState({
                        avatar: user.photoURL,
                    })
                })
            } 
        })
    }


    handleCancel = () => this.setState({ previewVisible: false })

    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                this.setState({ src: reader.result })
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    onSelectFileTwo = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
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

    handleUpload = () => {
        const { file } = this.state;
        const uploadTask = Firebase.storage().ref(`images/${file.name}`).put(file);
        uploadTask.on('state_changed',
            (snapshot) => {
                // progrss function ....
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                this.setState({ progress, loading: false });
            },
            (error) => {
                // error function ....
                console.log(error);
            },
            () => {
                // complete function ....
                Firebase.storage().ref('images').child(file.name).getDownloadURL().then(url => {
                    console.log(url);
                    this.setState({ url });
                })
            });
    }

    render() {
        const { croppedImageUrl } = this.state;
        const uploadButton = (
            <div class="upload-btn-wrapper">
                <img src={this.state.avatar} class="img-fluid" alt="Uploaded images" style={{borderRadius: '50%'}} />
                <input type="file" onChange={this.onSelectFile} />
            </div>
        );
        return (
            <div>
                <div className="avatar-uploader">
                    {croppedImageUrl ?
                        <div class="upload-btn-wrapper">
                            <div className="iconEdit">
                                <Icon type="edit" theme="filled" style={{ fontSize: 20, color: '#fff' }} />
                                <input type="file" onChange={this.onSelectFileTwo} />
                            </div>
                            <img src={croppedImageUrl} onClick={this.handlePreview} class="img-fluid" alt="avatar" width='250' style={{ borderRadius: '50%' }} />
                        </div>
                        : uploadButton}
                </div>
                <button onClick={this.handleUpload}>Upload</button>
                {this.state.src && (
                    <Modal style={{ top: 20 }} visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                        <ReactCrop
                            src={this.state.src}
                            crop={this.state.crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        />
                    </Modal>
                )}
            </div>
        );
    }
}
export default AvatarUpload