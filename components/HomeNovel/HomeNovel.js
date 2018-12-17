import React, { Component } from 'react'
import { Spin, Button, Tooltip, Divider, } from 'antd'
import { css } from 'react-emotion'
import { inject, observer } from 'mobx-react';

import CardList from '../MainCard/CardList'
import CardImage from '../MainCard/CardImage'
import Head from '../head'
import LayoutMain from '../Main/LayoutMain'

const SpinCostom = <div className="loading-spinner"></div>

@inject('authStore', 'novelStore')
@observer
export class HomeNovel extends Component {

    state = {
        grid: true,
    }

    componentWillMount() {
        this.props.novelStore.loading = true
    }

    async componentDidMount() {
        await this.props.authStore.getUser()
        await this.props.novelStore.reset()
        await this.props.novelStore.novelSearchHome()
    }
    render() {
        const { grid } = this.state
        const { novelListHome, loading } = this.props.novelStore
        const { user, uid } = this.props.authStore
        return (
            <div>
                <Head title={`Home - Episode2 `} />
                <div className="OverlayIndex">
                    <LayoutMain>
                        <div className="popular">
                            <div
                                className="NCardread"
                                style={{
                                    justifyContent: 'space-between',
                                    margin: '3em 0 0',
                                    flexDirection: 'row'
                                }}>
                                <h4
                                    className={css({
                                        display: 'flex',
                                        alignItems: 'flex-end'
                                    })}>อัพเดทล่าสุด</h4>
                                <Tooltip title={grid ? 'แบบรายการ' : 'แบบเรียงรูป'}>
                                    <Button ghost
                                        type="default" icon={grid ? 'bars' : 'appstore'} size={'large'}
                                        className="episodeB"
                                        onClick={() => this.setState({ grid: !grid })}
                                        style={{ margin: 0 }}
                                    />
                                </Tooltip>
                            </div>
                            <Divider />
                            <div>
                                <Spin indicator={SpinCostom} size="large" spinning={loading} >
                                    {grid ?
                                        <CardImage output={novelListHome} loading={loading} uid={uid} user={user} follow description />
                                        :
                                        <CardList output={novelListHome} loading={loading} uid={uid} user={user} />
                                    }
                                </Spin>
                            </div>

                        </div>
                        <Divider />
                        {/* <div className="popular">
                        <div className="NCardread" style={{ alignItems: 'flex-start' }}>
                            <h4>มาใหม่</h4>
                        </div>
                        <Timeline pending="Recording..." reverse={loading}>
                            {
                                output.map((item, i) => {
                                    return (
                                        <Timeline.Item
                                            dot={i === 0 && <Icon type="clock-circle-o" style={{ fontSize: '16px' }} className="jackpots" />}
                                            color={item.rating == 'ทั่วไป' ? '#6acc39' : item.rating == 'NC-18' ? "#f92200" : "#fbb937"}
                                            key={item.id}>
                                            <Link href={`/novel?id=${item.id}`} as={`/novel-${item.id}`}><a>{item.title} </a></Link>by<Link href={`/author?id=${item.authorId}`}><a> {item.author}</a></Link>
                                            <span className={css({ float: 'right' })}>{moment(`${item.createDate}`).locale('th').fromNow()}
                                            </span></Timeline.Item>
                                    )
                                })
                            }
                        </Timeline>
                    </div> */}
                    </LayoutMain>
                    {/* <HomeNovelTwo /> */}
                </div>
            </div>
        )
    }
}


export default HomeNovel
