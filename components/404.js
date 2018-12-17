import React from 'react'
import Head from '../components/head'
import Link from 'next/link'

export default class Page404 extends React.Component {
  render() {
    return (
      <div className="page404">
        <Head />
        <div className="wrapper">
          <h1>Oops!</h1>
          <p>เหมือนว่าคุณกำลังหลงอยู่ในหลุมดำ เราช่วยให้คุณหาทางกลับไหม?</p>
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