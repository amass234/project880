import React, { Component } from 'react'
import HeaderMain from '../components/Main/HeaderMain'
import FooterMain from '../components/Main/FooterMain'
import HomeNovel from '../components/HomeNovel/HomeNovel'

export class index extends Component {

  render() {
    return (
      <div>
        <HeaderMain />
        <HomeNovel/>
        <FooterMain />
      </div>
    )
  }
}

export default index

