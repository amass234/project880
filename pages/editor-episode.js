import React from 'react'
import { withRouter } from 'next/router'
import EditorE from '../components/Episode/EditorE'

const EditorEpidsode = withRouter((props) => (
  <div>
    <EditorE idNovel={props.router.query.e} idEpisode={props.router.query.id}/>
  </div>
))
export default EditorEpidsode
