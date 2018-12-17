import React, { Component } from 'react';
import { List, Button, Divider, Tooltip, Icon } from 'antd';
import Link from 'next/link'
import moment from 'moment'
import { Icon as IconKit } from 'react-icons-kit'
import { sortNumbericDesc } from 'react-icons-kit/icomoon/sortNumbericDesc'
import { sortNumericAsc } from 'react-icons-kit/icomoon/sortNumericAsc'
import LayoutMain from '../Main/LayoutMain'
import { css } from 'emotion';

const IconText = ({ type, text, theme }) => (
    <span>
        <Icon type={type} style={{ marginRight: 8 }} theme={theme} />
        {text}
    </span>
);

export class Nlist extends Component {

    state = {
        sort: this.props.sort
    }

    render() {
        const { initLoading, user, uid, authorId, id, data, endNovel } = this.props
        const { sort } = this.state
        const output = [...new Map(data.map(o => [o.id, o])).values()]
        return (
            <LayoutMain>
                <h3 className={css({ float: 'left', marginTop: '.5em' })}>
                    <Icon type="book" style={{ marginTop: -6 }} theme="outlined" />
                    {output.length === 0 ? ' ยังไม่มีตอน' : ' ' + output.length + ' ตอน'}
                    <Divider type='vertical' />
                    {!endNovel ? <span className={css({
                        fontSize: '.6em',
                        color: '#28a745'
                    })}>
                        <Link href='/search?e=false'><a>ยังไม่จบ</a></Link>
                    </span> :
                        <span className={css({
                            fontSize: '.6em',
                            color: '#fb427c'
                        })}><Link href='/search?e=true'><a>จบแล้ว</a></Link></span>}
                    <Divider type="vertical" />
                    <a onClick={() => this.setState({ sort: !sort })} className={css({
                        textDecoration: 'none',
                        cursor: 'pointer',
                        color: `${sort ? '#F4A261' : '#2A9D8F'}`
                    })}>
                        <IconKit icon={sort ? sortNumbericDesc : sortNumericAsc} />
                    </a>
                </h3>
                <div>
                    {
                        uid === authorId && user && !endNovel ?
                            <Tooltip placement="top" title="สร้างตอนใหม่">
                                <Button
                                    className="episodeB-2 episodeB"
                                    size="large" type="primary">
                                    <Link href={`/new-episode?id=${id}`} as={`/new/${id}`}><a><Icon type="plus" /></a></Link>
                                </Button>
                            </Tooltip> : <div />
                    }

                </div>
                <Divider />
                {/* <Skeleton title={false} loading={initLoading} active> */}
                <List
                    locale={{ emptyText: 'ไม่มีตอน' }}
                    loading={initLoading}
                    itemLayout="vertical"
                    size="large"
                    pagination={output.length > 20 ? {
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 20,
                    } : null}
                    style={{ marginBottom: 30 }}
                    dataSource={output}
                    renderItem={(item) => (
                        <List.Item
                            extra={<div style={{ color: '#b5b5b5' }}><span> 0 อ่าน | </span>
                                <IconText type="message" text={item.commentCount === undefined ? '0' : item.commentCount} theme="outlined" />
                                <span> | </span>
                                <Tooltip title={moment(`${item.createDate}`).locale("th").format('LLL')}>{moment(`${item.createDate}`).locale("th").fromNow()}</Tooltip>
                            </div>}>
                            <List.Item.Meta
                                title={
                                    <div className='Nlist'>
                                        {
                                            uid === authorId && user &&
                                            <span>
                                                <Link href={`/editor-episode?e=${id}&id=${item.href}`} as={`/edit-${id}-${item.href}`}>
                                                    <a title={`แก้ไข ${item.title}`}><Icon className="editIcon" type="edit" theme="outlined" /></a>
                                                </Link>
                                            </span>
                                        }
                                        <Link href={`/episode?e=${id}&id=${item.href}`} as={`/novel-${id}-${item.href}`}><a>{item.title}</a></Link>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
                {/* </Skeleton> */}
            </LayoutMain >
        )
    }
}

export default Nlist