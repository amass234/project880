import React, { Component } from 'react'
import { Row, Col, } from 'reactstrap'
import { Button, Avatar, Icon } from 'antd'
import LayoutMain from '../Main/LayoutMain'
import Firebase from '../../config/Firebase';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

export class Profilecard extends Component {
    state = {
        username: '',
        avatar: '',
        bio: ''
    }

    componentDidMount() {
        let user = Firebase.auth().currentUser
        this.setState({
            username: user.displayName,
            avatar: user.photoURL,
        })
    }

    render() {
        const { username, avatar } = this.state
        return (
            <div>
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
            </div>
        )
    }
}

export default Profilecard
