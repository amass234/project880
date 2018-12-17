import React, { Component } from 'react'
import Link from 'next/link'
import { Spin, Icon, Modal, Tooltip, message, Card, Button } from 'antd';
import { Row, Col } from 'reactstrap'
import { inject, observer } from 'mobx-react';
import LayoutMain from '../Main/LayoutMain'
import Firebase from '../../config/Firebase'
import { css } from 'emotion';

const confirm = Modal.confirm;
const SpinCostom = <div className="loading-spinner"></div>
const { Meta } = Card;

@inject('profileStore', 'novelStore')
@observer
export class ProfileNovelList extends Component {

    async componentDidMount() {
        await this.props.profileStore.getProfile()
        await this.props.profileStore.getProfileNovelList()
    }

    render() {
        const { novelList, loading } = this.props.profileStore
        const output = [...new Map(novelList.map(o => [o.id, o])).values()]
        return (
            <div>
                <LayoutMain>
                    <Spin indicator={SpinCostom} size="large" spinning={loading} >
                        {novelList.length == 0 ?
                            <div style={{ margin: '10em 0', display: 'flex', justifyContent: 'center' }}>
                                <h4 style={{marginRight: '1em'}}>เขียนนิยาย </h4>
                                <Tooltip placement="bottom" title="เขียนนิยาย">
                                    <Button type='default' className="create-novel episodeB">
                                        <Link href="/create-novel"><a className={css({ textDecoration: 'none' })}><Icon type="edit" /></a></Link>
                                    </Button>
                                </Tooltip>
                            </div>
                            :
                            <Row className='rowBookmark'>
                                {output.map((novel, i) => {
                                    const show = () => {
                                        confirm({
                                            title: `คูณต้องการลบนิยาย ${novel.title} แน่นะ?`,
                                            content: 'ลบแล้วไม่สามารถกู้คืนได้ ',
                                            okText: 'ลบนิยาย',
                                            okType: 'danger',
                                            cancelText: 'คิดดูก่อน',
                                            onOk() {
                                                return new Promise((resolve, reject) => {
                                                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                                                    const novelList = Firebase.firestore().collection('novels');
                                                    novelList.doc(novel.id).delete()
                                                }).then(() => message.success(`ลบนิยาย  ${novel.title} แล้ว`))
                                                    .catch((error) => message.error(error.message))
                                            },
                                            onCancel() {
                                                console.log('Cancel');
                                            },
                                        });
                                    }
                                    const lock = () => {
                                        confirm({
                                            title: `คูณต้องการให้นิยาย ${novel.title} จบแน่นะ?`,
                                            content: 'หลังจากจบไม่สามารถเพิ่มตอนได้อีก ',
                                            okText: 'จบเรื่องนี้',
                                            okType: 'danger',
                                            cancelText: 'คิดดูก่อน',
                                            onOk() {
                                                return new Promise((resolve, reject) => {
                                                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                                                    const novelList = Firebase.firestore().collection('novels');
                                                    novelList.doc(novel.id).update({ endNovel: true })
                                                }).then(() => message.success(`นิยาย  ${novel.title} ถูกตั้งให้จบแล้ว`))
                                                    .catch((error) => message.error(error.message))
                                            },
                                            onCancel() {
                                                console.log('Cancel');
                                            },
                                        });
                                    }
                                    return (
                                        <Col sm="3" key={novel.id} className={css({ margin: '2em 0',maxWidth: 200 })}>
                                            <Card
                                                bordered={false}
                                                style={{ marginBottom: '2em', }}
                                                cover={<img className="img-fluid" alt={novel.title} src={novel.cover} />}
                                                actions={[
                                                    <div>
                                                        {
                                                            novel.endNovel ?
                                                                <Tooltip title="นิยายเรื่องนี้จบแล้ว">
                                                                    <Icon type="file-done" className={css({
                                                                        color: '#28a745',
                                                                        cursor: 'default'
                                                                    })} />
                                                                </Tooltip>
                                                                :
                                                                <Tooltip placement="left" title="จบแล้ว ?">
                                                                    <Icon type="file-done" onClick={lock} />
                                                                </Tooltip>

                                                        }
                                                    </div>,
                                                    <Link href={`/editor/${novel.id}`}>
                                                        <a className="a">
                                                            <Tooltip placement="top" title="แก้ไข">
                                                                <Icon type="edit" />
                                                            </Tooltip>
                                                        </a>
                                                    </Link>,
                                                    <Tooltip placement="right" title="ลบนิยาย">
                                                        <Icon style={{ color: '#F44336' }} type="delete" onClick={show} />
                                                    </Tooltip>
                                                ]}
                                            >
                                                <Meta
                                                    title={<Link href={`/novel?id=${novel.id}`} as={`/novel-${novel.id}`}><a>{novel.title}</a></Link>}
                                                />
                                            </Card>
                                        </Col>
                                    )
                                })}
                            </Row>
                        }
                    </Spin>
                </LayoutMain>
            </div>
        )
    }
}

export default ProfileNovelList