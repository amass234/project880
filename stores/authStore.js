import { observable, action } from 'mobx'
import Firebase from '../config/Firebase'
import firebase from 'firebase'
import Router from 'next/router'
import { message, Icon, notification } from 'antd'

class AuthStore {

    @observable errors = undefined;
    @observable loading = false;
    @observable user
    @observable uid = ''
    @observable username = ''
    @observable avatar = ''
    @observable email = ''

    @observable values = {
        email: '',
        password: '',
    }

    openNotificationWithIcon = (type, message) => {
        notification[type]({
            message: type.toUpperCase(),
            description: message,
        });
    };
    openNotificationWithIconSignIn = (type, name) => {
        const key = 'updatable';
        notification[type]({
            key,
            message: type.toUpperCase(),
            description: `ยินดีตอนรับสู่ EPISODE2 ${name} เรารวบรวมนิยายสนุกๆมากมายไว้ที่นี้แล้ว`,
        })
        setTimeout(() => {
            notification.open({
                key,
                message: type.toUpperCase(),
                description: 'สามารถเปลี่ยนชื่อเล่นได้ที่หน้าเมนู จัดการโปรไฟล์',
                icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
            });
        }, 2000);
    };

    @action setEmail(email) {
        this.values.email = email;
    }

    @action setPassword(password) {
        this.values.password = password;
    }

    @action getUser() {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user
                this.uid = user.uid
                this.email = user.email
                this.username = user.displayName
                this.avatar = user.photoURL
                localStorage.setItem('user', user.uid);
                this.loading = false
            }
            else {
                this.user = null
                localStorage.removeItem('user');
                this.loading = false
            }
        })
    }

    @action logOut() {
        const _this = this
        Firebase.auth().signOut()
            .then(() => _this.openNotificationWithIcon('success', 'ออกจากระบบแล้ว'))
            .catch(error => _this.openNotificationWithIcon('error', error.message))
    }

    @action login() {
        const _this = this
        this.loading = true
        this.errors = undefined;
        return Firebase.auth().signInWithEmailAndPassword(this.values.email, this.values.password)
            .then(() => Router.replace('/').then(() => this.getUser(), _this.openNotificationWithIcon('success', `ยินดีต้อนรับกลับ ${this.username}`)))
            .catch((err) => this.openNotificationWithIcon('error', err.message))
            .finally(action(() => { this.loading = false; }));
    }


    @action facebookSignIn() {
        const _this = this
        this.loading = true
        let provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        Firebase.auth().signInWithPopup(provider)
            .then(() => Router.replace('/').then(() => this.getUser(), _this.openNotificationWithIcon('success', `ยินดีต้อนรับกลับ ${this.username}`)))
            .catch((err) => this.openNotificationWithIcon('error', err.message))
            .finally(action(() => { this.loading = false; }));
    }

    @action facebookSignup() {
        const _this = this
        this.loading = true
        let provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        Firebase.auth().signInWithPopup(provider)
            .then(() => {
                const user = Firebase.auth().currentUser
                let dbUser = Firebase.firestore().collection('users');
                dbUser.doc(user.uid).set({
                    id: user.uid,
                    username: user.displayName,
                    avatar: user.photoURL,
                    email: user.email,
                    mode: '1'
                }).then(() => {
                    Router.replace('/')
                        .then(() => _this.openNotificationWithIconSignIn('success', user.displayName))
                }).catch(err => {
                    message.error(err)
                    throw err;
                })
            }).catch(err => {
                message.error(err)
                throw err;
            }).finally(action(() => { this.loading = false; }));
    }

    @action googleSignin() {
        const _this = this
        this.loading = true
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        Firebase.auth().signInWithPopup(provider)
            .then(() => Router.replace('/').then(() => this.getUser(), _this.openNotificationWithIcon('success', `ยินดีต้อนรับกลับ ${this.username}`)))
            .catch((err) => this.openNotificationWithIcon('error', err.message))
            .finally(action(() => { this.loading = false; }));
    }

    @action googleSignup() {
        const _this = this
        this.loading = true
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        firebase.auth().signInWithPopup(provider)
            .then(() => {
                const user = Firebase.auth().currentUser
                let dbUser = Firebase.firestore().collection('users');
                dbUser.doc(user.uid).set({
                    id: user.uid,
                    username: user.displayName,
                    avatar: user.photoURL,
                    email: user.email,
                    mode: '1'
                }).then(() => {
                    Router.replace('/')
                        .then(() => _this.openNotificationWithIconSignIn('success', user.displayName))
                }).catch(err => {
                    message.error(err)
                    throw err;
                })
            }).catch(err => {
                message.error(err)
                throw err;
            }).finally(action(() => { this.loading = false; }));
    }

    @action register = () => {
        const _this = this
        this.loading = true
        return Firebase.auth().createUserWithEmailAndPassword(this.values.email, this.values.password)
            .then(
                () => {
                    const user = Firebase.auth().currentUser
                    let dbUser = Firebase.firestore().collection('users');
                    const email = user.email
                    let name = email.substring(0, email.lastIndexOf("@"))
                    user.updateProfile({
                        displayName: name,
                        photoURL: "/static/user-no.png",
                    })
                    dbUser.doc(user.uid).set({
                        id: user.uid,
                        username: name,
                        avatar: "/static/user-no.png",
                        email: this.values.email,
                        mode: '1'
                    }).then(() => {
                        Router.replace('/')
                            .then(() => _this.openNotificationWithIconSignIn('success', name))
                    }).catch(err => {
                        message.error(err)
                        throw err;
                    })
                }
            )
            .catch((err) => this.openNotificationWithIcon('error', err.message))
            .finally(action(() => { this.loading = false; }));
    }

}

export default new AuthStore()

