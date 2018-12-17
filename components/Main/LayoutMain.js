import React, { Component } from 'react'
import { Layout } from 'antd';

export class LayoutMain extends Component {
    render() {
        return (
            <Layout className="layout">               
                <div>
                    {this.props.children}
                </div>
            </Layout>
        )
    }
}

export default LayoutMain
