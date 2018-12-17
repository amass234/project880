import React, { Component } from 'react'
import Link from 'next/link'
import Firebase from '../../config/Firebase'
import LayoutMain from '../Main/LayoutMain'

export class NovelList extends Component {
    constructor() {
        super();
        this.state = {
            novelList: [],
        }
    }
    componentDidMount() {
        const itemsRef = Firebase.firestore().collection('novels');
        itemsRef.get().then((snapshot) => {
            let newState = [];
            snapshot.forEach(doc => {
                let items = doc.data();
                newState.push({
                    id: doc.id,
                    title: items.title,
                    author: items.author,
                    cover: items.cover,
                    description: items.description,
                    body: items.body,
                    tags: items.tags,
                    catalog: items.catalog,
                    rating: items.rating
                });
            })
            this.setState({
                novelList: newState,
                loading: false
            });
        });
    }

    render() {
        
        return (
            <div style={{ margin: '0 0 2em 0' }}>
                <LayoutMain>
                    {this.state.novelList.map((novel, i) => {
                        return (
                            <div key={i} >
                                <ul className="imglist">
                                    <li>
                                        <img src={novel.cover} alt={novel.title} />
                                        <Link href={`/novel?id=${novel.id}`} as={`/novel-${novel.id}`}><a>{novel.title}</a></Link>
                                    </li>
                                </ul>
                            </div>
                        )
                    })}
                </LayoutMain>
            </div>
        )
    }
}

export default NovelList
