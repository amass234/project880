import React from 'react'
import { withRouter } from 'next/router'
import HeaderMain from '../components/Main/HeaderMain'
import FooterMain from '../components/Main/FooterMain'
import SearchPage from '../components/Search/SearchPage';

const SearchPageMain = withRouter((props) => (
  <div className='site'>
    <HeaderMain />
    <SearchPage
      cat={props.router.query.cat}
      e={props.router.query.e}
      tag={props.router.query.tag}
      rating={props.router.query.rating}
    />
    <FooterMain />
  </div>
))
export default SearchPageMain