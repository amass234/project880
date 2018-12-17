import React, { Component } from 'react'
import { withRouter } from 'next/router'
import HeaderMain from '../components/Main/HeaderMain'
import FooterMain from '../components/Main/FooterMain'
import AuthorCard from '../components/Author/AuthorCard'
export class author extends Component {
  render() {
    return (
      <div>
        <HeaderMain/>
        <AuthorCard id={this.props.router.query.id}/>
        <FooterMain/>
      </div>
    )
  }
}

export default withRouter(author)
