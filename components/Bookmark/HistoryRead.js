import React, { Component } from 'react'
import { Divider, Icon, List, Spin, Avatar } from 'antd'
import Link from 'next/link'
import { inject, observer } from 'mobx-react';
import moment from 'moment'
import { Row, Col } from 'reactstrap'
import LayoutMain from "../Main/LayoutMain";
import { css } from 'emotion';

const SpinCostom = <div className="loading-spinner"></div>

@inject('novelStore', 'authStore')
@observer
export class HistoryRead extends Component {

    async componentDidMount() {
        await this.props.authStore.getUser()
        await this.props.novelStore.read()
    }

    render() {
        const { readStore, loading } = this.props.novelStore
        const { user } = this.props.authStore
        // const output = [...new Map(readStore.map(o => [o.id, o])).values()]
        return (
            <div className={`${css({marginBottom: '2em'})} site_content`}>
                <LayoutMain>
                    <Divider style={Styles.FonstPT} orientation="right">
                        <span><Icon type="book" theme="outlined" /> ประวัติการอ่าน</span>
                    </Divider>
                    <Spin indicator={SpinCostom} size="large" spinning={loading} >
                    <List
                        locale={{ emptyText: user ? 'ไม่มีประวัติ คุณอาจยังไม่ได้อ่าน' : 'ดูเหมือนว่าคุณยังไม่ได้เข้าสู่ระบบ ' }}
                        itemLayout="horizontal"
                        dataSource={readStore}
                        renderItem={item => (
                            <List.Item>
                                <Row className={css({ width: '100%' })}>
                                    <Col sm='8'>
                                        <List.Item.Meta
                                            avatar={<img src={item.cover} height='70' />}
                                            title={<Link href={`/novel?id=${item.id}`} as={`/novel-${item.id}`}><a>{item.title}</a></Link>}
                                            description={<div style={{fontWeight: '300'}}><span>อ่านต่อ : </span><Link href={item.href} as={item.as}><a>{item.episode}</a></Link></div>}
                                        />
                                    </Col>
                                    <Col>
                                        <span className={css({
                                            float: 'right'
                                        })}>{moment(`${item.time}`).locale("th").calendar()}</span>
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
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

export default HistoryRead
