import { observable, action, } from 'mobx';
import moment from 'moment'
import Router from 'next/router'
import Firebase from '../config/Firebase'

let date = moment().format('YYYY-MM-DDTHH:mm:ss');
let time = moment().format("LT");

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

const randomId = randomString(5, '#')

class CreateEpisode {

    @observable id = '';
    @observable idR = randomId;
    @observable body = '';
    @observable title = '';
    @observable loading = false;
    @observable date = date;
    @observable time = time

    randomString2 = (length, chars) => {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }
    @action reset() {
        const randomId = this.randomString2(5, '#')
        this.id = '';
        this.idR = randomId;
        this.body = '';
        this.title = '';
        this.loading = false
        this.date = new moment().format('YYYY-MM-DDTHH:mm:ss')
        this.time = new moment().format("LT")
    }

    @action setTitle(title) {
        this.title = title
    }
    @action setBody(body) {
        this.body = body
    }

    @action episodeBody(id, idepisode) {
        let dbCon = Firebase.firestore().collection('novels').doc(id + '/episode/' + idepisode);
        dbCon.get().then((snapshot) => {
            let item = snapshot.data();
            this.title = item.title
            this.body = item.body,
                this.loading = false
        })
    }

    @action create(id) {
        let user = Firebase.auth().currentUser
        let dbCon = Firebase.firestore().collection('novels').doc(id + '/episode/' + this.idR);
        dbCon.set({
            id: this.idR,
            body: this.body,
            title: this.title,
            author: user.displayName,
            createDate: `${this.date}`,
            createTime: `${this.time}`,
            commentCount: 0

        }).catch(this.loading = true)
            .then(() => Router.replace(`/novel?id=${id}`, `/novel-${id}`))
    }

    @action updateEpisode(id, idepisode) {
        let dbCon = Firebase.firestore().collection('novels').doc(id + '/episode/' + idepisode);
        dbCon.update({
            body: this.body,
            title: this.title,
            updateDate: `${this.date}`,
            updateTime: `${this.time}`,
        }).catch(this.loading = true)
            .then(() => Router.replace(`/novel?id=${id}`, `/novel-${id}`))
    }

}

export default new CreateEpisode()