import React, { Component } from 'react'
import { Row, Col, } from 'reactstrap'
import { Button, Avatar, Icon } from 'antd'
import { inject, observer } from 'mobx-react';

import AuthorTaps from './AuthorTaps'
import LayoutMain from '../Main/LayoutMain'
import Head from '../head';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

@inject('profileStore')
@observer
export class AuthorCard extends Component {

    async componentDidMount() {
        await this.props.profileStore.reset()
        await this.props.profileStore.getAuthor(this.props.id)
        await this.props.profileStore.getAuthorNovelList(this.props.id)
    }

    render() {
        const { username, avatar } = this.props.profileStore
        return (
            <div>
                <Head title={`นักเขียน @${username} - Episode2`} />
                <div className="NCardbgCoverOverlay">
                    <LayoutMain>
                        <Row>
                            <Col>
                                <Avatar src={avatar} size={150} />
                                <div className="NCardmain">
                                    <h3 className="NCardh3 text-monospace">
                                        <span>@ {username} </span>
                                        {/* <Tooltip placement="rightTop" title="ติดตามนักเขียน">
                                            <a href="#" style={{ color: '#ff0000' }}><Icon type="plus-square" theme="outlined" /></a>
                                        </Tooltip> */}
                                    </h3>
                                    <div>
                                        <h6 className="NCardbio"><span style={{ color: "#ccc" }}>เกี่ยวกับนักเขียน: </span> </h6>
                                    </div>
                                </div>
                                <Button type="default" size="large" ghost style={{ float: 'left' }}><IconFont type="icon-facebook" /></Button>
                                <Button type="default" size="large" ghost style={{ float: 'left' }}><IconFont type="icon-twitter" /></Button>

                            </Col>
                            {/* <Col sm="3">
                                
                            </Col> */}
                        </Row>
                    </LayoutMain>
                </div>
                <AuthorTaps id={this.props.id} />
            </div>
        )
    }
}

export default AuthorCard
