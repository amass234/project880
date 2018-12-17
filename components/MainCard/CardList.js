import React, { Component } from 'react'
import { Icon, List, Tooltip, Button, Tag, } from 'antd'
import Link from 'next/link'
import { css } from 'emotion';
import { Row, Col } from 'reactstrap';
import { fadeIn } from 'react-animations'
import styled, { keyframes } from 'styled-components';
import TextEllipsis from 'react-text-ellipsis';
import { inject, observer } from 'mobx-react';
import { Icon as Iconkit } from 'react-icons-kit'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { infinite } from 'react-icons-kit/icomoon/infinite'
import { checkmark } from 'react-icons-kit/icomoon/checkmark'

const fadeInAnimation = keyframes`${fadeIn}`;
const FadeInDiv = styled.div`
  animation: 1.3s ${fadeInAnimation};
`;


@inject('novelStore')
@observer
export class CardList extends Component {
    render() {
        const { uid, user, loading, output } = this.props
        return (
            <List
                locale={{ emptyText: loading ? 'กำลังค้นหา... รอสักครู่' : 'ไม่พบข้อมูล' }}
                itemLayout="vertical"
                dataSource={output}
                pagination={output.length > 8 ? {
                    onChange: (page) => {
                        console.log(page);
                    },
                    size: 'small',
                    pageSize: 5,
                } : null}
                renderItem={item => (
                    <FadeInDiv>
                        <List.Item
                            style={{
                                border: '1px solid #e8e8e8',
                                padding: '1em',
                                marginBottom: '1em'
                            }}
                            // className='searchItem'
                            key={item.id}
                            actions={[
                                <div className="NCardfooterCard">
                                    {
                                        item.catalog ?
                                            <div>{item.catalog.map((catalog, i) =>
                                                <Tag key={i} className="NCardchip" style={{ marginBottom: 10 }}>
                                                    <Link href={`/search?cat=${catalog}`}>
                                                        <a className={css({
                                                            color: '#444 !important',
                                                            textDecoration: 'none',
                                                        })}>{catalog}</a>
                                                    </Link>
                                                </Tag>
                                            )}</div> : <div />
                                    }
                                </div>,
                                <div className="NCardfooterCard">
                                    {
                                        item.tags ?
                                            <div>
                                                {item.tags.map((tags, i) =>
                                                    <Tag style={{ marginBottom: 10 }} key={i} className="NCardNoborder">
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
                            ]}
                            // <IconText type="like-o" text="156" />, <IconText type="message" text="2" />
                            extra={<Link href={`/novel?id=${item.id}`} as={`/novel-${item.id}`}><a>
                                <LazyLoadImage
                                    alt={item.title}
                                    effect="blur"
                                    height="252"
                                    placeholderSrc={item.cover}
                                    src={item.cover} /></a></Link>}>
                            <Row className={css({ width: '100%' })}>
                                <Col sm='8' className={css({ marginTop: '1em' })}>
                                    <List.Item.Meta
                                        title={
                                            <div>
                                                <Link href={`/novel?id=${item.id}`} as={`/novel-${item.id}`}><a>{item.title}</a></Link>
                                            </div>
                                        }
                                        description={<div>
                                            <span key='a' className={css({
                                                display: 'block',
                                                margin: 10,
                                                marginLeft: 0
                                            })}>
                                                <LazyLoadImage
                                                    alt={item.author}
                                                    effect="blur"
                                                    width="30"
                                                    src={item.avatar}
                                                    className={css({
                                                        borderRadius: '50%'
                                                    })} />
                                                <Link href={`/author?id=${item.authorId}`}><a className={css({ color: '#353535', textDecoration: 'none' })}> {item.author}</a></Link></span>
                                            <TextEllipsis
                                                lines={2}
                                                tag={'span'}
                                                ellipsisChars={'...'}
                                                tagClass={'textEllipsis'}
                                                debounceTimeoutOnResize={200}
                                                useJsOnly={true}>
                                                {item.description}
                                            </TextEllipsis>
                                            <Tag color={item.rating == 'ทั่วไป' ? '#6acc39' : item.rating == 'NC-18' ? "#f92200" : "#fbb937"}
                                                style={{ borderRadius: 0, marginRight: 10 }}>
                                                <Link href={`/search?rating=${item.rating}`}>
                                                    <a className={css({ textDecoration: 'none' })}>
                                                        <Icon type="star" theme="outlined" /> {item.rating}
                                                    </a>
                                                </Link>
                                            </Tag>
                                            <Tag color="#2db7f5" className={css({ borderRadius: 0, marginBottom: 10 })}><Icon type="eye" theme="outlined" /> 18504 อ่าน</Tag>
                                            <Tag color="#87d068" className={css({ borderRadius: 0, marginBottom: 10 })}><Icon type="book" theme="outlined" /> {item.episodecount} ตอน</Tag>
                                            <Tag style={{ borderRadius: 0, marginRight: 0 }} color={item.endNovel ? "#f92200" : "#2db7f5"} >
                                                {item.endNovel ? <Link href='/search?e=finish'><a title='จบแล้ว' className={css({
                                                    textDecoration: 'none'
                                                })}><Iconkit icon={checkmark} /></a></Link> : <Link href='/search?e=notfinish'><a title='ยังไม่จบ' className={css({
                                                    textDecoration: 'none'
                                                })}><Iconkit icon={infinite} /></a></Link>}
                                            </Tag>
                                        </div>
                                        }
                                    />
                                </Col>
                                <Col className={css({
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    display: 'flex',
                                })}>
                                    <div className="NCardread" style={{ flexDirection: 'row', justifyContent: 'center', margin: 0 }}>
                                        <Tooltip placement="top" title="เริ่มอ่าน">
                                            <Button ghost type="default" icon="read" size={'large'} className="NCardbuttonEdit episodeB" />
                                        </Tooltip>
                                        {uid === item.authorId && user ?
                                            <div className={css({ marginLeft: '1em' })}>
                                                <Tooltip placement="top" title="แก้ไข">
                                                    <Button
                                                        ghost
                                                        className="NCardbuttonEdit episodeB"
                                                        type="default"
                                                        size="large">
                                                        <Link href={`/editor?id=${item.id}`}>
                                                            <a><Icon style={{ color: '#fb427c' }} type="edit" /></a>
                                                        </Link>
                                                    </Button>
                                                </Tooltip> </div> :
                                            <div className={css({ marginLeft: '1em' })}>
                                                {
                                                    item.userBookmark ?
                                                        <Tooltip placement="top" title="เพิ่มเข้าชั้นหนังสือแล้ว">
                                                            <Button ghost type="default" size={'large'} className="NCardbuttonEdit episodeB episodeB2" onClick={() => this.props.novelStore.bookmarkNovelNone(item.id)}>
                                                                <Icon className={css({ color: '#fff' })} type="book" />
                                                            </Button>
                                                        </Tooltip>
                                                        : user ?
                                                            <Tooltip placement="top" title="เพิ่มเข้าชั้นหนังสือ">
                                                                <Button ghost type="default" icon="plus-square" size={'large'} className="NCardbuttonEdit episodeB" onClick={() => this.props.novelStore.bookmarkNovel(item.id)} />
                                                            </Tooltip> : <div />
                                                }
                                            </div>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </List.Item>
                    </FadeInDiv>
                )}
            />
        )
    }
}

export default CardList
