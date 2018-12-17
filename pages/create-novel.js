import React, { Component } from 'react'
import Head from '../components/head'
import HeaderMain from '../components/Main/HeaderMain'
import FooterMain from '../components/Main/FooterMain'
import CreateNovel from '../components/Create/CreateNovel'

export class NovelEdit extends Component {
  render() {
    return (
      <div>
        <Head title="Create - Epiosode2"/>
        <HeaderMain />
          <CreateNovel/>
        <FooterMain />
      </div>
    )
  }
}

export default NovelEdit
