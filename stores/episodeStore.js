import { observable, action, autorun } from 'mobx';
import Firebase from '../config/Firebase';
import moment from 'moment'
import ReactGA from 'react-ga';

class EpisodeStore {

    @observable bodyEpisode = '';
    @observable titleEpisode = '';
    @observable data = [];
    @observable initLoading = true;
    @observable loading = true;
    @observable episodeNextData = []
    @observable episodeNextTitle = ''
    @observable episodeNextLink = ''
    @observable background = '#fff'
    @observable color = '#4e4e4e'
    @observable uid = '';
    @observable user = undefined;
    @observable modeKey = '1'
    @observable comment = []

    @action reset() {
        this.titleEpisode = ''
        this.bodyEpisode = ''
        this.data = []
    }

    @action episodeList(id, sort) {
        const episodeList = Firebase.firestore().collection('novels').doc(id).collection('episode')
        const novelRef = Firebase.firestore().collection('novels').doc(id)
        sort == 'desc' ?
        episodeList.orderBy('createDate', 'desc')
            .onSnapshot(snapshot => {
                this.data = []
                let listData = []
                snapshot.forEach(doc => {
                    listData.push({
                        id: doc.id,
                        title: doc.data().title,
                        createDate: doc.data().createDate,
                        createTime: doc.data().createTime,
                        href: doc.id,
                        commentCount: doc.data().commentCount
                        // view: doc.data().pageCounts
                    }), this.data = [...new Map(listData.map(o => [o.id, o])).values()]
                })
                this.initLoading = false
                this.loading = false
                novelRef.update({
                    episodecount: listData.length
                })
            }) : episodeList.orderBy('createDate', 'asc')
                .onSnapshot(snapshot => {
                    this.data = []
                    let listData = []
                    snapshot.forEach(doc => {
                        listData.push({
                            id: doc.id,
                            title: doc.data().title,
                            createDate: doc.data().createDate,
                            createTime: doc.data().createTime,
                            href: doc.id,
                            commentCount: doc.data().commentCount
                            // view: doc.data().pageCounts
                        }), this.data = [...new Map(listData.map(o => [o.id, o])).values()]
                    })
                    this.initLoading = false
                    this.loading = false
                    novelRef.update({
                        episodecount: listData.length
                    })
                })
    }
    getComment(id, docid) {
        const commentList = Firebase.firestore().collection('novels').doc(id).collection('episode')
        const listComment = []
        commentList.onSnapshot(snapshot => {
            snapshot.forEach(doc => {
                listComment.push({
                    comment: doc.id
                })
                this.comment = [...listComment]
            })
        })
    }

    @action bookmarkPage(id, idepisode) {
        let date = new moment().format('YYYY-MM-DDTHH:mm:ss');
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const readdb = Firebase.firestore().collection('users');
                const novel = Firebase.firestore().collection('novels')
                novel.doc(id).get().then(snapshot => {
                    novel.doc(id).collection('episode').doc(idepisode).get().then(episode => {
                        readdb.doc(user.uid + '/read/' + id).set({
                            title: snapshot.data().title,
                            episode: episode.data().title,
                            cover: snapshot.data().cover,
                            time: `${date}`,
                            href: `/episode?e=${id}&id=${idepisode}`,
                            as: `/novel-${id}-${idepisode}`
                        })
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            }
        })
    }

    @action episode(id, idepisode) {
        const episode = Firebase.firestore().collection('novels');
        episode.doc(id + '/episode/' + idepisode).get()
            .then(snapshot => {
                let item = snapshot.data();
                this.titleEpisode = item.title
                this.bodyEpisode = item.body
                this.initLoading = false
                this.loading = false
            });
    }

    @action episodeNext(id, idepisode) {
        let listData = [];
        const episodeList = Firebase.firestore().collection('novels')
        episodeList.doc(id).collection('episode').orderBy('createDate', 'asc').get().then(snapshot => {
            snapshot.forEach(doc => {
                listData.push({
                    id: doc.id,
                    title: doc.data().title,
                    href: `/novel-${idepisode}-${doc.id}`,
                })
                this.episodeNextData = [listData[(listData.map(e => { return e.id; }).indexOf(`${idepisode}`) + 1)]]
            })
        })
    }

    @action setMode() {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const modeTheme = Firebase.firestore().collection('users');
                modeTheme.doc(user.uid).onSnapshot(snapshot => {
                    let item = snapshot.data();
                    this.modeKey = item.mode
                    if (item.mode === '2') this.background = '#373d49', this.color = '#e6e6e6'
                    else if (item.mode === '3') this.background = '#000710', this.color = '#fff'
                    else if (item.mode === '4') this.background = '#183369', this.color = '#ccc3be'
                    else this.background = '#fff', this.color = '#4e4e4e'
                })
            }
        })
    }

    @action onModeChage(key) {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.mode = key
                const modeTheme = Firebase.firestore().collection('users');
                modeTheme.doc(user.uid)
                    .update({
                        mode: key
                    })
            }
        })
    }

    @action hitCountEpisode(id, idepisode) {
        ReactGA.initialize('UA-50512327-1');
        // console.log(ReactGA.pageview(window.location.pathname + window.location.search))
        // const rootRef = Firebase.firestore()
        // const pageCountsRef = rootRef.collection('novels').doc(id).collection('episode').doc(idepisode)
        // pageCountsRef.update({
        //     hit_count: ReactGA.pageview(window.location.pathname + window.location.search)
        // })
    }
}
export default new EpisodeStore()