import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import Link from 'next/link'
import { Divider, Skeleton, Tooltip, Button, Icon, List } from 'antd'
import Editor from 'react-medium-editor'
import CommentBody from '../Comment/CommentBody'
import CommentInput from '../Comment/CommentInput';

@inject('episodeStore', 'authStore')
@observer
export class MainEpisode extends Component {

    componentWillMount() {
        this.props.episodeStore.setMode()
    }

    componentWillUnmount() {
        this.props.episodeStore.setMode()
    }

    async componentDidMount() {
        const id = this.props.idNovel
        const idepisode = this.props.idEpisode
        this.props.episodeStore.next = []
        await this.props.authStore.getUser()
        await this.props.episodeStore.reset()
        await this.props.episodeStore.episode(id, idepisode)
        await this.props.episodeStore.episodeNext(id, idepisode)
        await this.props.episodeStore.bookmarkPage(id, idepisode)
        await this.props.episodeStore.hitCountEpisode(id, idepisode)
    }

    async componentWillReceiveProps(nextProps) {
        const id = this.props.idNovel
        const idepisode = nextProps.idEpisode
        this.props.episodeStore.loading = true
        await this.props.episodeStore.episode(id, idepisode)
        await this.props.episodeStore.episodeNext(id, idepisode)
        await this.props.episodeStore.bookmarkPage(id, idepisode)
        await this.props.episodeStore.hitCountEpisode(id, idepisode)
    }

    render() {
        const { episodeNextData, background, loading, bodyEpisode, titleEpisode, color } = this.props.episodeStore
        const { avatar, user } = this.props.authStore
        return (
            <div>
                <div style={{ background }}>
                    <div className="layoutEpisode">
                        <Divider orientation="left" className='FonstPT' style={{ margin: 0, padding: '2em 0' }}><span style={{ color }}>{titleEpisode}</span></Divider>
                        <Skeleton style={{padding: 0}} loading={loading} title={false} paragraph={{ rows: 20 }} active>
                            <Editor
                                style={{ border: 'none', padding: '0 0 2em 0', color }}
                                text={bodyEpisode}
                                options={{ disableEditing: true, toolbar: false, placeholder: { text: "" } }}
                            />
                        </Skeleton>
                    </div>
                </div>
                <div className="footerEpisode">
                    <div className="layoutEpisode">
                        <div className='nextEpisode'>
                            {/* <List
                                itemLayout="horizontal"
                                dataSource={episodeNextData}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<a >{item.title}</a>}
                                        />
                                    </List.Item>
                                )}
                            /> */}
                            {/* {
                                next.map(e => {
                                    <div>
                                        <Tooltip placement="left" title={`ตอนต่อไป ${e.title}`}>
                                            <Button ghost type="default" size='large' className="NCardbuttonEdit episodeB">
                                                <Link href={`/episode?e=${this.props.idNovel}&id=${e.id}`} as={`/e/${this.props.idNovel}/${e.id}`}>
                                                    <a><Icon type="arrow-right" style={{ color: '#fff' }} /></a>
                                                </Link>
                                            </Button>
                                        </Tooltip>
                                    </div>
                                })
                            } */}
                        </div>
                        <CommentInput idNovel={this.props.idNovel} idEpisode={this.props.idEpisode} user={user} avatar={avatar} />
                        <CommentBody idNovel={this.props.idNovel} idEpisode={this.props.idEpisode} />
                    </div>
                </div>
            </div>
        )
    }
}

export default MainEpisode
