import React, { Component } from 'react'
import { List, Tag, Card, Icon } from 'antd'
import Link from 'next/link'
import { css } from 'emotion';
import { fadeIn } from 'react-animations'
import styled, { keyframes } from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Icon as Iconkit } from 'react-icons-kit'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { infinite } from 'react-icons-kit/icomoon/infinite'
import { checkmark } from 'react-icons-kit/icomoon/checkmark'
import TextEllipsis from 'react-text-ellipsis';

const { Meta } = Card;

const fadeInAnimation = keyframes`${fadeIn}`;
const FadeInDiv = styled.div`
  animation: 1.3s ${fadeInAnimation};
`;

@inject('novelStore')
@observer
export class CardImage extends Component {
    render() {
        const { loading, output, user, uid, follow, description, img } = this.props
        return (
            <List
                locale={{ emptyText: loading ? 'กำลังค้นหา... รอสักครู่' : 'ไม่พบข้อมูล' }}
                grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 6, xl: 6, xxl: 6 }}
                dataSource={output}
                pagination={output.length > 12 ? {
                    onChange: (page) => {
                        console.log(page);
                    },
                    size: 'small',
                    pageSize: 12,
                } : null}
                renderItem={item => (
                    <FadeInDiv>
                        <List.Item>
                            <Card
                                hoverable
                                // bordered={false}
                                cover={
                                    <div>
                                        <div className={css({ position: 'absolute', top: 0, right: 0, zIndex: 1 })}>
                                            <Tag style={{ borderRadius: 0, marginRight: 0 }} color={item.endNovel ? "#f92200" : "#2db7f5"} >
                                                {item.endNovel ? <Link href='/search?e=finish'><a title='จบแล้ว' className={css({
                                                    textDecoration: 'none'
                                                })}><Iconkit icon={checkmark} /></a></Link> : <Link href='/search?e=notfinish'><a title='ยังไม่จบ' className={css({
                                                    textDecoration: 'none'
                                                })}><Iconkit icon={infinite} /></a></Link>}
                                            </Tag>
                                        </div>
                                        <div className={css({
                                            display: 'flex',
                                            alignItems: 'flex-end'
                                        })}>
                                            <div className={css({
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'absolute',
                                                background: '#1f1f1f9e',
                                                zIndex: 1
                                            })}>
                                                <Tag color='transparent'
                                                    style={{
                                                        color: item.rating == 'ทั่วไป' ? '#6acc39' : item.rating == 'NC-18' ? "#f92200" : "#fbb937",
                                                        borderRadius: 0,
                                                        marginRight: 0,
                                                        borderTop: `1px solid ${item.rating == 'ทั่วไป' ? '#6acc39' : item.rating == 'NC-18' ? "#f92200" : "#fbb937"}`
                                                    }}>
                                                    <Link href={`/search?rating=${item.rating}`}>
                                                        <a className={css({ textDecoration: 'none' })}>
                                                            <Icon type="star" theme="outlined" /> {item.rating}
                                                        </a>
                                                    </Link>
                                                </Tag>
                                                <Tag style={{ borderRadius: 0, marginRight: 0 }} color="transparent" ><Icon type="eye" theme="outlined" /> 0 อ่าน</Tag>
                                                <Tag style={{ borderRadius: 0, marginRight: 0 }} color="transparent" ><Icon type="book" theme="outlined" /> {item.episodecount} ตอน</Tag>
                                                {follow ?
                                                    <div>
                                                        {uid === item.authorId && user ?
                                                            <Tag style={{ borderRadius: 0, marginRight: 0 }} color="#ff9900"><Icon type="edit" theme="outlined" />
                                                                <Link href={`/editor?id=${item.id}`}>
                                                                    <a className={css({ textDecoration: 'none' })}> แก้ไข</a>
                                                                </Link>
                                                            </Tag>
                                                            :
                                                            <div>
                                                                {
                                                                    item.userBookmark ?
                                                                        <Tag style={{ borderRadius: 0, marginRight: 0 }} color="#ff056d" onClick={() => this.props.novelStore.bookmarkNovelNone(item.id)} ><Icon type="check" theme="outlined" /> ติดตามแล้ว</Tag> :
                                                                        user ? <Tag style={{ borderRadius: 0, marginRight: 0 }} color="#6c757d" onClick={() => this.props.novelStore.bookmarkNovel(item.id)} ><Icon type="plus" theme="outlined" /> ติดตาม</Tag>
                                                                            : <div />
                                                                }
                                                            </div>
                                                        }</div> : null}
                                            </div>
                                            <Link href={`/novel?id=${item.id}`} as={`/novel-${item.id}`}>
                                                <a>{!img ?
                                                    <LazyLoadImage
                                                        placeholderSrc={item.cover}
                                                        alt={item.title}
                                                        effect="blur"
                                                        width="100%"
                                                        src={item.cover} /> :
                                                    <img src={item.cover} width="100%" alt={item.title} />}</a>
                                            </Link>
                                        </div>
                                    </div>}>
                                <Meta
                                    title={item.title}
                                    description={description ?
                                        <div className={css({ display: 'flex' })}>
                                            <span className={css({
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            })}>
                                                <Link href={`/author?id=${item.authorId}`} as={`/author/${item.authorId}`}>
                                                    <a className={css({ color: '#c7c7c7', textDecoration: 'none' })}>{item.author}</a>
                                                </Link>
                                            </span>
                                        </div>
                                        : null
                                    }
                                />
                            </Card>
                        </List.Item>
                    </FadeInDiv>
                )}
            />
        )
    }
}

export default CardImage
