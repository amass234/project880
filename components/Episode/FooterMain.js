import React, { Component } from 'react'
import { Layout, Icon  } from 'antd';

const { Footer } = Layout;
export class FooterMain extends Component {
    render() {
        return (
            <Footer style={{ textAlign: 'center', fontSize: 20 }}>
                <Icon type="heart" theme="filled" /> 2018 EPISODE2
            </Footer>
        )
    }
}

export default FooterMain
