import React, { Component } from 'react'
import Link from 'next/link'
import { inject, observer } from 'mobx-react';
import { Avatar, List, Icon, Collapse, Divider, Tooltip } from 'antd'
import moment from 'moment'
import FadeIn from 'react-fade-in';
import { css } from 'react-emotion'
import { Row, Col } from 'reactstrap'
import NumericLabel from 'react-pretty-numbers';

const Panel = Collapse.Panel;
const IconText = ({ type, text, theme }) => (
    <span>
        <Icon type={type} className={css({ marginRight: 8, fontSize: 20, marginBottom: 20 })} theme={theme} />
        {text <= 1000 ? `${text}` :
            <NumericLabel params={{ currency: false, shortFormatPrecision: 1, commafy: true, shortFormat: true, justification: 'L' }}>
                {text}
            </NumericLabel>
        }
    </span>
);

@inject('commentStore', 'authStore')
@observer
export class CommentBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            like: false,
            dislike: false,
        }
    }

    async componentDidMount() {
        const id = this.props.idNovel
        const idepisode = this.props.idEpisode
        await this.props.commentStore.reset()
        await this.props.authStore.getUser()
        await this.props.commentStore.CommentBody(id, idepisode)
    }

    async componentWillUnmount() {
        const id = this.props.idNovel
        const idepisode = this.props.idEpisode
        await this.props.commentStore.CommentBody(id, idepisode)
    }

    async componentWillReceiveProps(nextProps) {
        await this.props.commentStore.reset()
        const id = this.props.idNovel
        const idepisode = nextProps.idEpisode
        await this.props.commentStore.CommentBody(id, idepisode)
    }

    smileClick = (idcomment) => {
        const id = this.props.idNovel
        const idepisode = this.props.idEpisode
        this.props.commentStore.smileClick(id, idepisode, idcomment)
    }

    frownClick = (idcomment) => {
        const id = this.props.idNovel
        const idepisode = this.props.idEpisode
        this.props.commentStore.frownClick(id, idepisode, idcomment)
    }

    render() {
        const { loading, commentList } = this.props.commentStore
        const { user } = this.props.authStore
        // const user = Firebase.database().ref('users')
        // const usernew = output.map((item, i) => {
        //         user.child(item.userid).on('value', (snapshot) => {
        //             return
        //             const avatarnew = snapshot.val().avatar
        //             const usernamenew = snapshot.val().username
        //         })
        //     })
        // console.log(avatarnew)
        return (
            <div className="commentLayout">
                <Collapse bordered={false} defaultActiveKey={['1']}>
                    <Panel header={<Icon type="ellipsis" />} key="1" style={{ fontSize: 20 }}>
                        <List
                            style={{ padding: 0 }}
                            locale={{ emptyText: user ? 'เป็นคนแรกที่แสดงความคิดเห็นสิ' : 'เข้าสู่ระบบก่อนแสดงความคิดเห็น' }}
                            loading={loading}
                            itemLayout="horizontal"
                            dataSource={commentList}
                            pagination={commentList.length > 10 ? {
                                onChange: (page) => {
                                    console.log(page);
                                },
                                size: 'small',
                                pageSize: 10,
                            } : null}
                            renderItem={item => (
                                <FadeIn>
                                    <List.Item key={item.id}>
                                        <Row className={css({ width: '100%' })}>
                                            <Col sm="9">
                                                <List.Item.Meta
                                                    avatar={<Avatar size={45} src={item.avatar} />}
                                                    title={
                                                        <div>
                                                            <div className={css({
                                                                background: '#f1f1f1',
                                                                borderRadius: '3em',
                                                                padding: '.5em',
                                                                color: '#505050',
                                                                fontSize: 16,
                                                                width: 'fit-content',
                                                            })}>
                                                                <Link href={`#${item.id}`}>
                                                                    <a className={css({ color: '#87badd', marginRight: 10, textDecoration: 'none' })}>
                                                                        {item.username}
                                                                    </a>
                                                                </Link>
                                                                {item.comment}
                                                            </div>
                                                            <span style={{ fontSize: 12, color: '#ccc', marginLeft: '1em' }}>
                                                                <Tooltip title={moment(`${item.createDate}`).locale("th").format('LLL')}>
                                                                    {moment(`${item.createDate}`).locale("th").fromNow()}
                                                                </Tooltip>
                                                            </span>
                                                        </div>
                                                    }
                                                />
                                            </Col>
                                            {/* <Col sm="3">
                                                    <div className={css({ float: 'right' })}>
                                                        {user ?
                                                            <a className={css({ cursor: 'pointer' })} onClick={() => this.smileClick(item.id)}>
                                                                <IconText
                                                                    type="smile"
                                                                    text={item.likeCount}
                                                                    theme={item.like ? "filled" : "outlined"}
                                                                />
                                                            </a> :
                                                            <IconText
                                                                type="smile"
                                                                text={item.likeCount}
                                                                theme={item.like ? "filled" : "outlined"}
                                                            />
                                                        }
                                                        <Divider type="vertical" />
                                                        {user ?
                                                            <a className={css({ cursor: 'pointer' })} onClick={() => this.frownClick(item.id)}>
                                                                <IconText
                                                                    type="frown"
                                                                    text={item.dislikeCount}
                                                                    theme={user && item.dislike ? "filled" : "outlined"}
                                                                />
                                                            </a>
                                                            :
                                                            <IconText
                                                                type="frown"
                                                                text={item.dislikeCount}
                                                                theme={user && item.dislike ? "filled" : "outlined"}
                                                            />
                                                        }
                                                    </div>
                                                </Col> */}
                                        </Row>
                                    </List.Item>
                                </FadeIn>
                            )}
                        />
                    </Panel>
                </Collapse>
            </div>
        )
    }
}

export default CommentBody
