import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Divider, Icon, Tabs } from 'antd'
import LayoutMain from "../Main/LayoutMain";
import ProfileNovelList from './ProfileNovelList';
import ProfileSetting from './ProfileSetting';
import EmailSetting from './EmailSetting'

const TabPane = Tabs.TabPane;

@inject('authStore')
@observer
export class Setting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id
        }
    }
    componentDidMount() {
        this.props.authStore.getUser()
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ id: nextProps.id })
    }
    render() {
        const { user, loading } = this.props.authStore
        return (
            <LayoutMain>
                <Divider style={Styles.FonstPT} orientation="right">
                    <span><Icon type="tool" theme="outlined" /> Account Settings</span>
                </Divider>
                <Tabs tabPosition="top" defaultActiveKey={this.state.id} size="large">
                    <TabPane style={Styles.padding}
                        tab={<span style={{ fontSize: 16 }}><Icon type="skin" theme="outlined" />โปรไฟล์</span>}
                        key="1">
                        {user ? <ProfileSetting /> : <h6>{loading ? 'Checking user...' : 'กรุณาเข้าสู่ระบบก่อน'}</h6>}
                    </TabPane>
                    <TabPane tab={<span style={{ fontSize: 16 }}><Icon type="setting" theme="outlined" />จัดการบัญชี</span>} key="2">
                        {user ? <EmailSetting /> : <h6>{loading ? 'Checking user...' : 'กรุณาเข้าสู่ระบบก่อน'}</h6>}
                    </TabPane>
                    <TabPane tab={<span style={{ fontSize: 16 }}><Icon type="book" theme="outlined" />จัดการหนังสือ</span>} key="3">
                        {user ? <ProfileNovelList /> : <h6>{loading ? 'Checking user...' : 'กรุณาเข้าสู่ระบบก่อน'}</h6>}
                    </TabPane>
                </Tabs>
            </LayoutMain>
        )
    }
}

const Styles = {
    FonstPT: {
        marginTop: '1em',
        fontFamily: '"PraJad", "PraJaditalic", "PraJad-bold", "PraJad-boldItalic"',
        fontSize: 25,
    },
    padding: {
        paddingTop: '1.5em',
        paddingBottom: '1.5em'
    }

}
export default Setting
