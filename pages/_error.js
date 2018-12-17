import React from 'react'
import Head from '../components/head'
import Link from 'next/link'
import Router from 'next/router'

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode }
  }

  render() {
    return (
      <div className="page404">
        <Head />
        <div className="wrapper">
          <h1>Oops!</h1>
          <p>เหมือนว่าคุณกำลังหลงอยู่ในหลุมดำ เราช่วยให้คุณหาทางกลับไหม?</p>
          <p>
            {this.props.statusCode
              ? `An error ${this.props.statusCode} occurred on server`
              : 'An error occurred on client'}
          </p>
          <div className="buttons"><Link href="/">home</Link><br /><span>Help me out</span></div>
        </div>
        <div className="space">
          <div className="blackhole"></div>
          <div className="ship"></div>
        </div>
      </div>

    )
  }
}