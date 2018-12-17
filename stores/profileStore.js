import { observable, action, } from 'mobx';
import Firebase from '../config/Firebase'
import { notification } from 'antd'

class ProfileStore {

    @observable username = ''
    @observable avatar = ''
    @observable email = ''
    @observable firstname = ''
    @observable lastname = ''
    @observable birthdate = '1/01/2018'
    @observable tel = ''
    @observable spinning = true
    @observable loading = true
    @observable loadingP = false
    @observable file = null
    @observable progress = 0;
    @observable novelList = []
    @observable password = ''

    openNotificationWithIcon = (type, message) => {
        notification[type]({
            message: 'อัพเดท',
            description: message,
        });
    };

    @action reset() {
        this.novelList = []
        this.username = '',
            this.avatar = ''
    }

    @action setUser(username) { this.username = username }
    @action setFirstname(firstname) { this.firstname = firstname }
    @action setLastname(lastname) { this.lastname = lastname }
    @action serBirthdate(birthdate) { this.birthdate = birthdate }
    @action setTel(tel) { this.tel = tel }
    @action setPassword(password) { this.password = password }
    @action setEmail(email) { this.email = email }

    @action getProfile() {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let dbUser = Firebase.firestore().collection('users');
                dbUser.doc(user.uid).get()
                    .then(snapshot => {
                        let item = snapshot.data();
                        this.firstname = item.firstname
                        this.lastname = item.lastname
                        this.birthdate = item.birthdate
                        this.tel = item.tel
                        this.uid = user.uid
                        this.username = user.displayName
                        this.avatar = user.photoURL
                        this.email = user.email
                        this.spinning = false
                    })
            }
        })
    }

    @action getAuthor(id) {
        const itemsRef = Firebase.firestore().collection('users');
        itemsRef.doc(id).get().then(snapshot => {
            let item = snapshot.data();
            this.username = item.username
            this.avatar = item.avatar
        })
    }

    @action profileUpdate(file, name, img) {
        let user = Firebase.auth().currentUser
        let dbUser = Firebase.firestore().collection('users');
        this.loading = true
        if (file) {
            const uploadTask = Firebase.storage().ref('images/')
            uploadTask.child(`${name}`).putString(img, 'data_url').on('state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    this.progress = progress
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    Firebase.storage().ref('images').child(`${name}`).getDownloadURL().then(url => {
                        user.updateProfile({
                            displayName: this.username,
                            photoURL: url,
                        })
                        dbUser.doc(this.uid).update({
                            id: this.uid,
                            username: this.username,
                            avatar: url,
                            firstname: this.firstname,
                            lastname: this.lastname,
                            birthdate: this.birthdate,
                            tel: this.tel
                        }).then(() => {
                            this.loading = false,
                                this.openNotificationWithIcon('success', 'อัพเดทโปรไฟล์เสร็จสิ้น')
                        }).catch(error => {
                            this.loading = false,
                                this.openNotificationWithIcon('error', 'มีบางอย่างผิดพลาด โปรดติดต่อเว็บมาสเตอร์')
                        })
                    })
                })
        } else {
            user.updateProfile({
                displayName: this.username,
                photoURL: this.avatar,
            })
            dbUser.doc(this.uid).update({
                id: this.uid,
                username: this.username,
                avatar: this.avatar,
                firstname: this.firstname,
                lastname: this.lastname,
                birthdate: this.birthdate,
                tel: this.tel
            }).then(() => {
                this.loading = false,
                    this.openNotificationWithIcon('success', 'อัพเดทโปรไฟล์เสร็จสิ้น')
            }).catch(error => {
                this.loading = false,
                    this.openNotificationWithIcon('error', 'มีบางอย่างผิดพลาด โปรดติดต่อเว็บมาสเตอร์')
            })
        }
    }

    @action getProfileNovelList() {
        this.loading = true
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                let newState = [];
                const itemsRef = Firebase.firestore().collection('users').where('authorId', "==", user.uid)
                itemsRef.onSnapshot(snapshot => {
                    snapshot.forEach(doc => {
                        newState.push({
                            id: doc.id,
                            title: doc.data().title,
                            cover: doc.data().cover,
                            endNovel: doc.data().endNovel,
                        })
                        this.novelList = [...new Map(newState.map(o => [o.id, o])).values()],
                        this.loading = false

                    })
                }),
                    this.loading = false
            } else this.loading = false
        })
    }

    @action getAuthorNovelList(uid) {
        this.loading = true
        let newState = [];
        const itemsRef = Firebase.firestore().collection('novels').where('authorId', '==', uid);
        const userdb = Firebase.firestore().collection('users')
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                itemsRef.get().then((snapshot) => {
                    snapshot.forEach(doc => {
                        let authorId = doc.data().authorId
                        const novelRoot = Firebase.firestore().collection('novels/' + doc.id + '/bookmarkUser')
                        userdb.doc(authorId).onSnapshot((userget) => {
                            novelRoot.doc(user.uid).onSnapshot(book => {
                                let items = doc.data();
                                newState.push({
                                    id: doc.id,
                                    userBookmark: book.data() !== undefined ? book.data().bookmark : false,
                                    title: items.title,
                                    author: userget.data().username,
                                    authorId: items.authorId,
                                    cover: items.cover,
                                    avatar: userget.data().avatar,
                                    description: items.description,
                                    body: items.body,
                                    tags: items.tags,
                                    catalog: items.catalog,
                                    rating: items.rating,
                                    episodecount: items.episodecount,
                                    endNovel: items.endNovel
                                }),
                                    this.novelList = [...new Map(newState.map(o => [o.id, o])).values()],
                                    this.loading = false
                            })
                        })
                    })
                }).then(() => this.loading = false, this.novelList = [])
                    .catch((error) => { this.loading = false, message.error(error) })
            } else {
                itemsRef.get().then((snapshot) => {
                    let newState = [];
                    snapshot.forEach(doc => {
                        let authorId = doc.data().authorId
                        userdb.doc(authorId).onSnapshot((userget) => {
                            let items = doc.data();
                            newState.push({
                                id: doc.id,
                                title: items.title,
                                author: userget.data().username,
                                authorId: items.authorId,
                                cover: items.cover,
                                avatar: userget.data().avatar,
                                description: items.description,
                                body: items.body,
                                tags: items.tags,
                                catalog: items.catalog,
                                rating: items.rating,
                                episodecount: items.episodecount,
                                endNovel: items.endNovel
                            }),
                                this.novelList = [...new Map(newState.map(o => [o.id, o])).values()],
                                this.loading = false
                        })
                    })
                }).then(() => this.loading = false, this.novelList = [])
                    .catch((error) => { this.loading = false, message.error(error) })
            }
        })
    }


    @action updateEmail() {
        this.loading = true
        var user = Firebase.auth().currentUser
        user.updateEmail(this.email)
            .then(() => {
                this.loading = false,
                    this.openNotificationWithIcon('success', 'อัพเดทอีเมลล์เสร็จสิ้น')
            }).catch(error => {
                this.loading = false
                this.openNotificationWithIcon('error', error.message)
                console.log(error)

            })
    }

    @action updatePassword() {
        this.loadingP = true
        var user = Firebase.auth().currentUser
        user.updatePassword(this.password)
            .then(() => {
                this.loadingP = false,
                    this.openNotificationWithIcon('success', 'อัพเดทพาสเวิร์ดเสร็จสิ้น')
            }).catch(error => {
                this.loadingP = false,
                    this.openNotificationWithIcon('error', error.message),
                    console.log(error)
            })
    }
}

export default new ProfileStore()