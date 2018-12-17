import React from 'react'
import { withRouter } from 'next/router'
import HeaderMain from '../components/Main/HeaderMain'
import FooterMain from '../components/Main/FooterMain'
import NovelMain from '../components/Novel/NovelMain'

const Novel = withRouter((props) => (
  <div>
    <HeaderMain />
      <NovelMain id={props.router.query.id} />
    <FooterMain />
  </div>
))
export default Novel
