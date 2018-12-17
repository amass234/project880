import React, { Component } from 'react'
import { withRouter } from 'next/router'
import Setting from '../components/Profile/Setting'
import Head from '../components/head'
import HeaderMain from '../components/Main/HeaderMain'
import FooterMain from '../components/Main/FooterMain'

export class settingPage extends Component {
    render() {
        return (
            <div className='site'>
                <Head />
                <HeaderMain />
                <div className="site">
                    <Setting id={this.props.router.query.id} />
                </div>
                <FooterMain />
            </div>
        )
    }
}
export default withRouter(settingPage)