import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Row, Col, } from 'reactstrap'
import { Button, Avatar, Tag, Icon, Tooltip, Skeleton } from 'antd'
import Link from 'next/link'
import { css } from 'react-emotion'
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Head from '../head'
import LayoutMain from '../Main/LayoutMain'
import Ntaps from './Ntaps';
import Nlist from './Nlist';

@inject('novelStore', 'episodeStore', 'authStore')
@observer
export class NovelMain extends Component {

    state = {
        sort: false
    }

    async componentDidMount() {
        const id = this.props.id
        const sortChang = !this.state.sort ? 'desc' : 'asc' 
        this.props.novelStore.userBookmark = false
        await this.props.episodeStore.reset()
        await this.props.authStore.getUser()
        await this.props.novelStore.novelView(id)
        await this.props.episodeStore.episodeList(id, sortChang)
        await this.props.novelStore.checkUserBookmark(id)
    }

    async componentWillReceiveProps(nextProps) {
        const id = nextProps.id
        const sortChang = this.state.sort == false ? 'desc' : 'asc' 
        await this.props.episodeStore.reset()
        this.props.novelStore.userBookmark = false
        await this.props.novelStore.novelView(id)
        await this.props.episodeStore.episodeList(id, sortChang)
        await this.props.novelStore.checkUserBookmark(id)
    }

    handleBookmark = () => this.props.novelStore.bookmarkNovel(this.props.id)
    handleBookmarkNone = () => this.props.novelStore.bookmarkNovelNone(this.props.id)

    render() {
        const { body, loading, cover, rating, userBookmark, title, avatar, author, description, catalog, tags, authorId, id, endNovel, warning } = this.props.novelStore
        const { data, initLoading } = this.props.episodeStore
        const { user, uid } = this.props.authStore
        const { sort } = this.state
        const episodeOne = [data.length == 0 ? '' : data[0]]
        return (
            <div>
                <Head title={`${title} | Episode2`} />
                <div className="NCardbgCoverOverlay">
                    {/* <div className="ribbon"></div> */}
                    <LayoutMain>
                        <Skeleton avatar={{ shape: 'square', size: 'large' }} loading={loading} paragraph={{ rows: 9 }} title={false} active>
                            <Row>
                                <Col sm="3">
                                    <Tag
                                        onClick={() => warning(rating)}
                                        color={rating == 'ทั่วไป' ? '#6acc39' : rating == 'NC-18' ? "#f92200" : "#fbb937"}
                                        className={css({
                                            backgroundColor: 'rgb(106, 204, 57)',
                                            position: 'absolute',
                                            borderRadius: 0,
                                            height: 33,
                                            fontSize: '1em',
                                            lineHeight: '2.3em',
                                        })}>
                                        <Icon type="star" />
                                        {` ${rating}`}
                                    </Tag>
                                    <LazyLoadImage
                                        placeholderSrc={cover}
                                        alt={title}
                                        effect="opacity"
                                        src={cover}
                                        wrapperClassName="NCardcover img-fluid" />
                                    {/* <img src={cover} alt="" className="NCardcover img-fluid" /> */}
                                </Col>
                                <Col sm="8" className="NcardMain-2">
                                    <div className="NCardmain">
                                        <h3 className="NCardh3 text-monospace">
                                            <span className={css({
                                                display: 'flex',
                                                alignItems: 'center',
                                                alignContent: 'center',
                                            })}>
                                                {title}
                                            </span>
                                        </h3>
                                        <div>
                                            <h5 className="NCardh5">
                                                <Avatar src={avatar} className="NCardavatar" />
                                                โดย <span><Link href={`/author?id=${authorId}`}><a className={css({ color: '#353535', textDecoration: 'none' })}>{author}</a></Link></span>
                                                {/* <Tooltip placement="rightTop" title="ติดตามนักเขียน">
                                                <a href="#" style={{ color: '#ff0000' }}><Icon type="plus-square" theme="outlined" /></a>
                                            </Tooltip> */}
                                            </h5>
                                            <h6 className="NCardbio">{description}</h6>
                                        </div>
                                    </div>
                                    <div className="NCardfooterCard">
                                        {
                                            catalog ?
                                                <div>{catalog.map((catalog, i) =>
                                                    <Tag key={i} color="#fff" className="NCardchip">
                                                        <Link href={`/search?cat=${catalog}`}>
                                                            <a className={css({
                                                                color: '#444 !important',
                                                                textDecoration: 'none',
                                                            })}>{catalog}</a>
                                                        </Link>
                                                    </Tag>
                                                )}</div> : <div />
                                        }
                                    </div>
                                    <div className="NCardfooterCard">
                                        {
                                            tags ?
                                                <div>
                                                    {tags.map((tags, i) =>
                                                        <Tag key={i} style={{ marginBottom: 10 }}>
                                                            <Link href={`/search?tag=${tags}`}>
                                                                <a className={css({
                                                                    color: '#444 !important',
                                                                    textDecoration: 'none',
                                                                })}>{tags}</a>
                                                            </Link>
                                                        </Tag>
                                                    )}
                                                </div> : <div />
                                        }
                                    </div>
                                    <div className="NCardread">
                                        <div className="NCardview">
                                            <Tag color="#2db7f5" className={css({ marginBottom: 10 })}><Icon type="eye" theme="outlined" /> 0 อ่าน</Tag>
                                            <Tag color="#87d068" className={css({ marginBottom: 10 })}><Icon type="book" theme="outlined" /> {data.length} ตอน</Tag>
                                        </div>
                                        <div className={css({ display: 'flex' })}>
                                            {
                                                data.length > 0 ?
                                                    <div>
                                                        {
                                                            episodeOne.map((item, i) => {
                                                                return (
                                                                    <Tooltip key={i} placement="top" title="เริ่มอ่าน">
                                                                        <Button ghost type="default" size={'large'} className="episodeB">
                                                                            <Link href={`/episode?e=${this.props.id}&id=${item.href}`}
                                                                                as={`/novel-${this.props.id}-${item.href}`}>
                                                                                <a className={css({ textDecoration: 'none' })}>
                                                                                    <Icon type="read" />
                                                                                </a>
                                                                            </Link>
                                                                        </Button>
                                                                    </Tooltip>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    :
                                                    <div />
                                            }
                                            {uid === authorId && user ?
                                                <Tooltip placement="top" title="แก้ไข">
                                                    <Button
                                                        ghost
                                                        className="episodeB"
                                                        type="default"
                                                        size="large"
                                                    >
                                                        <Link href={`/editor?id=${id}`}>
                                                            <a><Icon style={{ color: '#fb427c' }} type="edit" /></a>
                                                        </Link>
                                                    </Button>
                                                </Tooltip> :
                                                <div>
                                                    {
                                                        userBookmark ?
                                                            <Tooltip placement="top" title="เพิ่มเข้าชั้นหนังสือแล้ว">
                                                                <Button ghost type="default" size={'large'} className="episodeB episodeB2" onClick={() => this.handleBookmarkNone()}>
                                                                    <Icon className={css({ color: '#fff' })} type="book" />
                                                                </Button>
                                                            </Tooltip>
                                                            : user ?
                                                                <Tooltip placement="top" title="เพิ่มเข้าชั้นหนังสือ">
                                                                    <Button ghost type="default" icon="plus-square" size={'large'} className="episodeB" onClick={() => this.handleBookmark()} />
                                                                </Tooltip> : <div />
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Skeleton>
                    </LayoutMain>
                </div>
                <Ntaps body={body} loading={loading} />
                <Nlist authorId={authorId} initLoading={initLoading} id={id} data={data} user={user} uid={uid} endNovel={endNovel} sort={sort} />
            </div >
        )
    }
}

const Styles = {
    NCardbgCover: {

    }
}

export default NovelMain
