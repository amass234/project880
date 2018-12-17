import React, { Component } from 'react'
import { withRouter } from 'next/router'
import HeaderMain from '../components/Main/HeaderMain'
import FooterMain from '../components/Main/FooterMain'
import EditorNovel from '../components/Editor/EditorNovel'

export class NovelEdit extends Component {
  render() {
    return (
      <div className="site">
        <HeaderMain />
        <div className="site">
          <EditorNovel id={this.props.router.query.id} />
        </div>
        <FooterMain />
      </div>
    )
  }
}

export default withRouter(NovelEdit)
