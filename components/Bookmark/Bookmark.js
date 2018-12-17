import React, { Component } from 'react'
import { Divider, Icon, Spin } from 'antd'
import { inject, observer } from 'mobx-react';
import LayoutMain from "../Main/LayoutMain";
import CardImage from '../MainCard/CardImage';
import CardList from '../MainCard/CardList';


const SpinCostom = <div className="loading-spinner" />

@inject('novelStore', 'authStore')
@observer
export class Bookmark extends Component {

    async componentDidMount() {
        await this.props.authStore.getUser()
        await this.props.novelStore.bookmark()
    }

    render() {
        const { bookmarkStore, loading } = this.props.novelStore
        const { user, uid } = this.props.authStore
        const outputBookmarkStore = [...new Map(bookmarkStore.map(o => [o.id, o])).values()]
        return (
            <div className='site_content'>
                <LayoutMain>
                    <Divider style={Styles.FonstPT} orientation="right">
                        <span><Icon type="book" theme="outlined" /> บุ๊คมาร์คหนังสือ</span>
                    </Divider>
                    <Spin indicator={SpinCostom} size="large" spinning={loading} >
                        {bookmarkStore.length === 0 ?
                            <div style={{ margin: '10em 0' }}>
                                {
                                    user ? <h6 className="text-center"> ไม่พบบุ๊คมาร์คหนังสือ </h6> :
                                        <h6 className="text-center"> ดูเหมือนว่าคุณยังไม่ได้เข้าสู่ระบบ </h6>
                                }
                            </div>
                            : <CardImage output={outputBookmarkStore} loading={loading} uid={uid} user={user} />
                        }
                    </Spin>
                </LayoutMain>
            </div>
        )
    }
}

const Styles = {
    FonstPT: {
        marginTop: '1em',
        fontFamily: '"PraJad", "PraJaditalic", "PraJad-bold", "PraJad-boldItalic"',
        fontSize: 25,
    },
}

export default Bookmark
