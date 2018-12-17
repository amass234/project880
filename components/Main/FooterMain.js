import React, { Component } from 'react'
import { Layout, Icon } from 'antd';
import { css } from "react-emotion";
import LayoutMain from './LayoutMain'

const { Footer } = Layout;

export class FooterMain extends Component {
    render() {
        return (
            <Footer className={css({
                width: '100%',
                height: 60,
                flex: 'none'
            })}>
                <LayoutMain>
                    <Icon type="heart" theme="filled" /> EPISODE2 ©2018
                </LayoutMain>
            </Footer>
        )
    }
}

export default FooterMain
