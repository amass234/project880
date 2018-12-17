import React from 'react'
import { withRouter } from 'next/router'
import Head from '../components/head'
import HeaderMain from '../components/Main/HeaderMain'
import FooterMain from '../components/Main/FooterMain'
import Bookmark from '../components/Bookmark/Bookmark'

const BookmarkUser = withRouter((props) => (
  <div className='site'>
    <Head />
    <HeaderMain />
      <Bookmark />
    <FooterMain />
  </div>
))
export default BookmarkUser