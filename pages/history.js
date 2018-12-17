import React from 'react'
import { withRouter } from 'next/router'
import Head from '../components/head'
import HeaderMain from '../components/Main/HeaderMain'
import FooterMain from '../components/Main/FooterMain'
import HistoryRead from '../components/Bookmark/HistoryRead';

const HistoryUser = withRouter((props) => (
  <div className='site'>
    <Head title="History - Episode2"/>
    <HeaderMain />
      <HistoryRead />
    <FooterMain />
  </div>
))
export default HistoryUser