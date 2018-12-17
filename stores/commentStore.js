import { observable, action, } from 'mobx';
import moment from 'moment'
import Firebase from '../config/Firebase'

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    // if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

const randomId = randomString(5, '#a')


class CommentStore {

    @observable id = randomId
    @observable commentList = []
    @observable loading = true
    @observable like = false
    @observable dislike = false
    @observable love = false
    @observable comment = ''

    @action setComment(comment) {
        this.comment = comment
    }

    @action reset() {
        const randomId = this.randomString(5, '#a')
        this.id = randomId
        this.commentList = []
        this.comment = ''
    }

    randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }

    @action smileClick(id, idepisode, idcomment) {
        const rootRef = Firebase.database().ref('novel/' + id + '/episode/' + idepisode + '/comment');
        const comment = rootRef.child(idcomment);
        comment.update({
            likeCount: this.like + 1,
            like: !this.like,
            dislike: false
        })
    }

    @action frownClick(id, idepisode, idcomment) {
        const rootRef = Firebase.database().ref('novel/' + id + '/episode/' + idepisode + '/comment');
        const comment = rootRef.child(idcomment);
        comment.update({
            dislikeCount: this.dislike + 1,
            like: false,
            dislike: !this.dislike
        })
    }

    @action createComment(id, idepisode) {
        let date = moment().format('YYYY-MM-DDTHH:mm:ss');
        let time = moment().format("LT");
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const comment = Firebase.firestore().collection('novels').doc(id).collection('episode').doc(idepisode).collection('comment')
                comment.doc(this.id).set({
                    userid: user.uid,
                    username: user.displayName,
                    avatar: user.photoURL,
                    comment: this.comment,
                    createDate: `${date}`,
                    createTime: `${time}`,
                    like: false,
                    love: false,
                    dislike: false,
                    likeCount: 0,
                    loveCount: 0,
                    dislikeCount: 0,
                })
            }
        })

    }

    @action async CommentBody(id, idepisode) {
        const comment = Firebase.firestore().collection('novels').doc(id).collection('episode').doc(idepisode).collection('comment')
        const user = Firebase.firestore().collection('users')
        const comments = Firebase.firestore().collection('novels').doc(id).collection('episode').doc(idepisode)
        let listData = [];
        await comment.orderBy('createDate', 'asc')
            .onSnapshot(snapshot => {
                snapshot.forEach(childSnapshot => {
                    user.doc(childSnapshot.data().userid).onSnapshot(doc => {
                        listData.push({
                            id: childSnapshot.id,
                            avatar: doc.data().avatar,
                            username: doc.data().username,
                            createDate: childSnapshot.data().createDate,
                            comment: childSnapshot.data().comment
                            // ...childSnapshot.data()
                        })
                        this.commentList = [...new Map(listData.map(o => [o.id, o])).values()]
                        this.loading = false
                        comments.update({
                            commentCount: [...new Map(listData.map(o => [o.id, o])).values()].length
                        })
                    })
                })
            }), this.loading = false
    }

    getAvatar(id) {
        const user = Firebase.firestore().collection('users')
        user.doc(id).get().then(snapshot => {
            this.avatar = snapshot.data().avatar
            this.username = snapshot.data().username
        })
    }
}

export default new CommentStore()