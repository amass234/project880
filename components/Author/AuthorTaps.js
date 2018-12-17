import React, { Component } from 'react';
import { Divider, Icon, Spin, Tooltip, Button, Card, Tabs } from 'antd'
import { inject, observer } from 'mobx-react';
import { css } from 'react-emotion'
import CardList from '../MainCard/CardList'
import CardImage from '../MainCard/CardImage'
import LayoutMain from '../Main/LayoutMain'

const TabPane = Tabs.TabPane;
const SpinCostom = <div className="loading-spinner"></div>

@inject('profileStore', 'authStore')
@observer
class AuthorTaps extends Component {

    state = {
        grid: true,
    }

    async componentDidMount() {
        await this.props.profileStore.reset()
        await this.props.authStore.getUser()
        await this.props.profileStore.getAuthorNovelList(this.props.id)
    }

    render() {
        const { grid } = this.state
        const { user, uid } = this.props.authStore
        const { novelList, loading } = this.props.profileStore
        return (
            <div className={css({ marginBottom: '2em' })}>
                <LayoutMain>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={<span style={{ fontSize: 20 }}><Icon type="file-text" theme="outlined" />งานเขียน</span>} key="1">
                            <div
                                className="NCardread"
                                style={{
                                    justifyContent: 'flex-end',
                                    margin: '0 1em 0 0',
                                    flexDirection: 'row'
                                }}>
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
                            <Spin indicator={SpinCostom} size="large" spinning={loading} >
                                {grid ?
                                    <CardImage output={novelList} loading={loading} uid={uid} user={user} follow description />
                                    :
                                    <CardList output={novelList} loading={loading} uid={uid} user={user} />
                                }
                            </Spin>

                        </TabPane>
                        <TabPane disabled tab={<span style={{ fontSize: 20 }}><Icon type="star" theme="outlined" />ที่ติดตาม</span>} key="2">
                        </TabPane>
                    </Tabs>
                </LayoutMain>
            </div>
        );
    }
}

export default AuthorTaps;