import { observable, action } from 'mobx';
import { notification, message } from 'antd'
import Link from 'next/link'
// import ReactGA from 'react-ga';
import Firebase from '../config/Firebase'

class NovelStore {

    @observable id = '';
    @observable authorId = '';
    @observable cover = '';
    @observable avatar = '';
    @observable body = '';
    @observable title = '';
    @observable avatar = '';
    @observable description = '';
    @observable tags = [];
    @observable avatar = '';
    @observable author = '';
    @observable rating = '';
    @observable catalog = [];
    @observable view = '';
    @observable mode = '';
    @observable loading = true;
    @observable userBookmark = false;
    @observable endNovel = false;
    @observable bookmarkStore = [];
    @observable readStore = [];
    @observable novelListHome = []
    @observable episodecount = 0

    @action reset() {
        this.bookmarkStore = [];
        this.readStore = [];
        this.novelListHome = []
    }

    @action warning(rating) {
        rating == 'ทั่วไป' ?
            notification.open({
                message: <span style={{ color: '#6acc39', marginTop: -6 }}>นิยาย {rating}</span>,
                description: <h6>อนุญาตให้ทุกวัยเข้าชมได้ อาจประกอบไปด้วยความรุนแรงทางจินตนาการหรือความรุนแรงทางอารมณ์ขัน แต่ต้องไม่มีภาพโป๊ ภาพเปลือย เรื่องเกี่ยวกับกิจกรรมทางเพศหรือเกี่ยวข้องกับเนื้อหาทางเพศ เครื่องดื่มแอลกอฮอล์และยาสูบอาจพบได้ในปริมาณน้อย</h6>,
            }) :
            rating == 'PG-13' ?
                notification.open({
                    message: <span style={{ color: '#fbb937', marginTop: -6 }}>นิยาย {rating}</span>,
                    description: <h6>อนุญาตให้ทุกวัยเข้าชมได้ แต่เนื่องจากเนื้อหาบางส่วนอาจจะไม่เหมาะสมกับเด็กและเยาวชนอายุต่ำกว่า 13 ปี โดยเด็กและเยาวชนอายุต่ำกว่า 13 ปีต้องมีผู้ปกครองหรือผู้ใหญ่ร่วมชมและคอยให้คำเตือน เนื่องจากเนื้อหาประกอบไปด้วย ความรุนแรงระดับปานกลาง การใช้ภาษาที่รุนแรง การใช้ภาษาไม่เหมาะสม ภาพโป๊ ภาพเปลือย กิจกรรมทางเพศหรือเกี่ยวข้องกับเนื้อหาทางเพศ และ/หรือการใช้ยาเสพติดเพียงเล็กน้อย</h6>,
                }) :
                rating == 'PG-15' ?
                    notification.open({
                        message: <span style={{ color: '#fbb937', marginTop: -6 }}>นิยาย {rating}</span>,
                        description: <h6>อนุญาตให้ทุกวัยเข้าชมได้ แต่เนื่องจากเนื้อหาบางส่วนอาจจะไม่เหมาะสมกับเด็กและเยาวชนอายุต่ำกว่า 15 ปี โดยเด็กและเยาวชนอายุต่ำกว่า 15 ปีต้องมีผู้ปกครองหรือผู้ใหญ่ร่วมชมและคอยให้คำเตือน เนื่องจากเนื้อหาประกอบไปด้วย ความรุนแรงระดับปานกลาง การใช้ภาษาที่รุนแรง การใช้ภาษาไม่เหมาะสม ภาพโป๊ ภาพเปลือย กิจกรรมทางเพศหรือเกี่ยวข้องกับเนื้อหาทางเพศ และ/หรือการใช้ยาเสพติดเพียงเล็กน้อย</h6>,
                    }) :
                    notification.open({
                        message: <span style={{ color: '#f62e39', marginTop: -6 }}>นิยาย {rating}</span>,
                        description: <h6>ไม่อนุญาตให้เด็กและเยาวชนอายุต่ำกว่า 18 ปี เข้าชมโดยเด็ดขาด เพราะเป็นนิยายที่มีเนื้อหาที่อันตรายอย่างชัดเจนและเนื้อหาที่เหมาะสมสำหรับผู้ปกครองหรือผู้ใหญ่เท่านั้น เนื้อหาประกอบไปด้วย ความโหดร้าย ความรุนแรงระดับมากที่สุด ภาพสยดสยอง การใช้ภาษาที่รุนแรงระดับมากที่สุด การใช้ภาษาไม่เหมาะสม ภาพโป๊ ภาพเปลือย กิจกรรมทางเพศหรือเกี่ยวข้องกับเนื้อหาทางเพศ และ/หรือการใช้ยาเสพติด </h6>,
                    })
    }

    @action async novelView(id) {
        this.loading = true
        // ReactGA.pageview(`/n/${id}`)
        this.id = id
        const user = Firebase.firestore().collection('users')
        const itemsRef = Firebase.firestore().collection('novels').doc(id);
        await itemsRef.get().then((snapshot) => {
            user.doc(snapshot.data().authorId).get().then((doc) => {
                const item = snapshot.data()
                this.authorId = item.authorId,
                    this.title = item.title,
                    this.cover = item.cover,
                    this.description = item.description,
                    this.body = item.body,
                    this.tags = item.tags,
                    this.catalog = item.catalog,
                    this.rating = item.rating,
                    this.confirmAge = item.confirmAge,
                    this.author = doc.data().username,
                    this.avatar = doc.data().avatar,
                    this.endNovel = item.endNovel,
                    this.loading = false
            })
        })
        // await itemsRef.collection('episode').orderBy('createDate', 'asc')
        //     .get().then(snapshot => {
        //         snapshot.forEach(doc => {
        //             listData.push({
        //                 id: doc.id
        //             })
        //         })
        //     }).then(() => {
        //         const count = listData.length == 0 ? 0 : listData.length
        //         this.episodecount = count
        //         Firebase.auth().onAuthStateChanged((user) => user ? user.uid == this.authorId && itemsRef.update({ episodecount: count }) : null)
        //     })
    }

    @action episodeList(id) {
        let listData = []
        const episodeList = Firebase.firestore().collection('novels').doc(id).collection('episode')
        episodeList.orderBy('createDate', 'asc')
            .onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    listData.push({
                        id: doc.id,
                        title: doc.data().title,
                        createDate: doc.data().createDate,
                        createTime: doc.data().createTime,
                        href: doc.id,
                        // view: doc.data().pageCounts
                    })
                })
            })
    }

    @action async novelSearchHome() {
        this.loading = true
        const userdb = Firebase.firestore().collection('users')
        const itemsRef = Firebase.firestore().collection('novels')
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                itemsRef.get().then((snapshot) => {
                    let newState = [];
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
                                    createDate: items.createDate,
                                    episodecount: items.episodecount,
                                    endNovel: items.endNovel
                                }),
                                    this.novelListHome = [...new Map(newState.map(o => [o.id, o])).values()],
                                    this.loading = false
                            })
                        })
                    })
                }).catch(() => this.loading = false)
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
                                createDate: items.createDate,
                                endNovel: items.endNovel
                            }),
                                this.novelListHome = [...new Map(newState.map(o => [o.id, o])).values()],
                                this.loading = false
                        })
                    })
                }).then(() => this.loading = false, this.novelListHome = [])
                    .catch((error) => { this.loading = false, message.error(error) })
            }
        })
    }

    @action bookmarkNovel(id) {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const refRoot = Firebase.firestore().collection('users/' + user.uid + '/bookmark');
                const novelRoot = Firebase.firestore().collection('novels/' + id + '/bookmarkUser')
                refRoot.doc(id).set({
                    id,
                    href: `/novel?id=${id}`,
                    as: `/novel-${id}`,
                })
                novelRoot.doc(user.uid).set({ bookmark: true }).then(() =>
                    message.success([
                        'เพิ่มเข้าชั้นหนังสือแล้ว ', <Link href='/bookmark'><a key='b'> ดู</a></Link>
                    ]))
            }
        })
    }

    @action bookmarkNovelNone(id) {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const refRoot = Firebase.firestore().collection('users/' + user.uid + '/bookmark');
                const novelRoot = Firebase.firestore().collection('novels/' + id + '/bookmarkUser')
                refRoot.doc(id).delete()
                novelRoot.doc(user.uid).update({ bookmark: false }).then(() => message.success('ลบชั้นหนังสือแล้ว'))
            }
        })
    }

    @action checkUserBookmark(id) {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const novelRoot = Firebase.firestore().collection('novels/' + id + '/bookmarkUser')
                novelRoot.doc(user.uid).onSnapshot(snapshot => {
                    const item = snapshot.data();
                    if (item !== undefined) this.userBookmark = item.bookmark
                })
            }
        })
    }

    @action bookmark() {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const itemsRef = Firebase.firestore().collection('users/' + user.uid + '/bookmark');
                itemsRef.onSnapshot(snapshot => {
                    let dbNovel = Firebase.firestore().collection('novels');
                    let newState = [];
                    snapshot.forEach(doc => {
                        dbNovel.doc(doc.id).onSnapshot(snapshots => {
                            newState.push({
                                id: doc.id,
                                title: snapshots.data().title,
                                author: snapshots.data().author,
                                cover: snapshots.data().cover,
                                rating: snapshots.data().rating,
                                episodecount: snapshots.data().episodecount,
                                as: doc.data().as,
                                href: doc.data().href,
                            })
                            this.bookmarkStore = newState,
                                this.loading = false
                        })
                    })
                }), this.loading = false
            } else this.loading = false
        })
    }

    @action read() {
        this.loading = true
        let readStore = [];
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const novelRef = Firebase.firestore().collection('novels')
                const itemsRef = Firebase.firestore().collection('users/' + user.uid + '/read').orderBy('time', 'desc');
                itemsRef.get().then(snapshot => {
                    snapshot.forEach(doc => {
                        novelRef.doc(doc.id).get().then(novel => {
                            readStore.push({
                                id: doc.id,
                                cover: novel.data().cover,
                                title: novel.data().title,
                                as: doc.data().as,
                                href: doc.data().href,
                                time: doc.data().time,
                                episode: doc.data().episode
                            })
                        }).then(() => this.readStore = readStore, this.loading = false)
                            .catch(err => console.log(err))
                    })
                })
            } else this.loading = false
        })
    }
}

export default new NovelStore();