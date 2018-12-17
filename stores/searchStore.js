import { observable, action } from 'mobx';
import { message } from 'antd'
import Firebase from '../config/Firebase'

class SearchStore {

    @observable loading = false
    @observable loading2 = false
    @observable novelListChid = []
    @observable novelListNew = []
    @observable novelList = []
    @observable keyword = ""
    @observable word = ""

    @action searchingFor(word) {
        return x => {
            return x.title.toLowerCase().includes(word.toLowerCase()) || !word;
        }
    }

    @action reset() {
        this.keyword = ""
        this.word = ""
        this.novelList = []
        this.novelListChid = []
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
                                    this.novelListNew = [...new Map(newState.map(o => [o.id, o])).values()],
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
                                this.novelListNew = [...new Map(newState.map(o => [o.id, o])).values()],
                                this.loading = false
                        })
                    })
                }).then(() => this.loading = false, this.novelListNew = [])
                    .catch((error) => { this.loading = false, message.error(error) })
            }
        })
    }

    @action async novelSearch(word) {
        word == '' ? this.word = 'ทั้งหมด' : this.word = word
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
                                    episodecount: items.episodecount,
                                    endNovel: items.endNovel
                                }),
                                    this.novelList = newState.filter(this.searchingFor(word)),
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
                                endNovel: items.endNovel
                            }),
                                this.novelList = newState.filter(this.searchingFor(word)),
                                this.loading = false
                        })
                    })
                }).then(() => this.loading = false, this.novelList = [])
                    .catch((error) => { this.loading = false, message.error(error) })
            }
        })
    }

    @action async novelSearchCatalog(cat) {
        this.word = `หมวดหมู่ ${cat}`
        if (cat) {
            this.loading = true
            const userdb = Firebase.firestore().collection('users')
            const itemsRef = Firebase.firestore().collection('novels').where('catalog', 'array-contains', cat)
            let newState = [];
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
                                        this.novelList = newState,
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
                                    this.novelList = newState,
                                    this.loading = false
                            })
                        })
                    }).then(() => this.loading = false, this.novelList = [])
                        .catch((error) => { this.loading = false, message.error(error) })
                }
            })
        } else return this.novelList = []
    }

    @action async novelSearchTage(tags) {
        this.word = `แท็ก ${tags}`
        if (tags) {
            this.loading = true
            const userdb = Firebase.firestore().collection('users')
            const itemsRef = Firebase.firestore().collection('novels').where('tags', 'array-contains', tags)
            let newState = [];
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
                                        this.novelList = newState,
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
                                    this.novelList = newState,
                                    this.loading = false
                            })
                        })
                    }).then(() => this.loading = false, this.novelList = [])
                        .catch((error) => { this.loading = false, message.error(error) })
                }
            })
        } else return this.novelList = []
    }


    @action async novelSearchEndNovel(e) {
        e == "finish" ? this.word = 'จบแล้ว' :
            e == "notfinish" ? this.word = 'ยังไม่จบ' :
                this.word = ''
        if (e) {
            this.loading = true
            const userdb = Firebase.firestore().collection('users')
            const itemsRef = Firebase.firestore().collection('novels').where('endNovel', '==', e === 'finish' ? true : false)
            let newState = [];
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
                                        this.novelList = newState,
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
                                    this.novelList = newState,
                                    this.loading = false
                            })
                        })
                    }).then(() => this.loading = false, this.novelList = [])
                        .catch((error) => { this.loading = false, message.error(error) })
                }
            })
        } else return this.novelList = []
    }

    @action async novelSearchRating(rating) {
        this.word = `เรท ${rating}`
        if (rating) {
            this.loading = true
            const userdb = Firebase.firestore().collection('users')
            const itemsRef = Firebase.firestore().collection('novels').where('rating', '==', rating)
            let newState = [];
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
                                        this.novelList = newState,
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
                                    this.novelList = newState,
                                    this.loading = false
                            })
                        })
                    }).then(() => this.loading = false, this.novelList = [])
                        .catch((error) => { this.loading = false, message.error(error) })
                }
            })
        } else return this.novelList = []
    }

    @action async novelSearchChid(word) {
        this.keyword = word
        this.loading2 = true
        const itemsRef = Firebase.firestore().collection('novels')
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                itemsRef.get().then((snapshot) => {
                    let newState = [];
                    snapshot.forEach(doc => {
                        let items = doc.data();
                        newState.push({
                            id: doc.id,
                            title: items.title,
                            cover: items.cover
                        }),
                            this.novelListChid = newState.filter(this.searchingFor(word)),
                            this.loading2 = false
                    })
                }).catch(() => this.loading2 = false)
            } else {
                itemsRef.get().then((snapshot) => {
                    let newState = [];
                    snapshot.forEach(doc => {
                        let items = doc.data();
                        newState.push({
                            id: doc.id,
                            title: items.title,
                            cover: items.cover
                        }),
                            this.novelListChid = newState.filter(this.searchingFor(word)),
                            this.loading2 = false
                    })
                }).then(() => this.loading2 = false, this.novelList = [])
                    .catch((error) => { this.loading2 = false, message.error(error) })
            }
        })
    }

    @action async novelSearchCatalogChid(value) {
        this.keyword = value
        if (value) {
            this.loading2 = true
            const itemsRef = Firebase.firestore().collection('novels').where('catalog', 'array-contains', value)
            let newState = [];
            Firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    itemsRef.get().then((snapshot) => {
                        snapshot.forEach(doc => {
                            let items = doc.data();
                            newState.push({
                                id: doc.id,
                                title: items.title,
                                cover: items.cover
                            }),
                                this.novelListChid = newState,
                                this.loading2 = false
                        })

                    }).then(() => this.loading2 = false, this.novelListChid = [])
                        .catch((error) => { this.loading2 = false, message.error(error) })
                } else {
                    itemsRef.get().then((snapshot) => {
                        let newState = [];
                        snapshot.forEach(doc => {
                            let items = doc.data();
                            newState.push({
                                id: doc.id,
                                title: items.title,
                                cover: items.cover
                            }),
                                this.novelListChid = newState,
                                this.loading2 = false

                        })
                    }).then(() => this.loading2 = false, this.novelListChid = [])
                        .catch((error) => { this.loading2 = false, message.error(error) })
                }
            })
        } else return this.novelListChid = []
    }

    @action async novelSearchEndNovelChid(value) {
        value == 'true' ? this.keyword = 'จบแล้ว' : value == 'false' ? this.keyword = 'ยังไม่จบ' : this.keyword = ''
        if (value) {
            this.loading2 = true
            const itemsRef = Firebase.firestore().collection('novels').where('endNovel', '==', value === 'true' ? true : false)
            let newState = [];
            Firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    itemsRef.get().then((snapshot) => {
                        snapshot.forEach(doc => {
                            let items = doc.data();
                            newState.push({
                                id: doc.id,
                                title: items.title,
                                cover: items.cover
                            }),
                                this.novelListChid = newState,
                                this.loading2 = false
                        })

                    }).then(() => this.loading2 = false, this.novelListChid = [])
                        .catch((error) => { this.loading2 = false, message.error(error) })
                } else {
                    itemsRef.get().then((snapshot) => {
                        let newState = [];
                        snapshot.forEach(doc => {
                            let items = doc.data();
                            newState.push({
                                id: doc.id,
                                title: items.title,
                                cover: items.cover
                            }),
                                this.novelListChid = newState,
                                this.loading2 = false

                        })
                    }).then(() => this.loading2 = false, this.novelListChid = [])
                        .catch((error) => { this.loading2 = false, message.error(error) })
                }
            })
        } else return this.novelListChid = []
    }

    @action async novelSearchRatingChid(rating) {
        this.word = `เรท ${rating}`
        if (rating) {
            this.loading2 = true
            const userdb = Firebase.firestore().collection('users')
            const itemsRef = Firebase.firestore().collection('novels').where('rating', '==', rating)
            let newState = [];
            Firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    itemsRef.get().then((snapshot) => {
                        snapshot.forEach(doc => {
                            let items = doc.data();
                            newState.push({
                                id: doc.id,
                                title: items.title,
                                cover: items.cover,
                            }),
                                this.novelListChid = newState,
                                this.loading2 = false
                        })

                    }).then(() => this.loading2 = false, this.novelListChid = [])
                        .catch((error) => { this.loading2 = false, message.error(error) })
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
                                    cover: items.cover,
                                }),
                                    this.novelListChid = newState,
                                    this.loading2 = false
                            })
                        })
                    }).then(() => this.loading2 = false, this.novelListChid = [])
                        .catch((error) => { this.loading2 = false, message.error(error) })
                }
            })
        } else return this.novelListChid = []
    }


}

//.where("title", "==", "소유(SoYou) X 정기고(JunggiGo) ")
export default new SearchStore()