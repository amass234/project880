import React from 'react'
import { withRouter } from 'next/router'
import CreateEpisode from '../components/Episode/CreateEpisode'

const Episode = withRouter((props) => (
  <div>
    <CreateEpisode id={props.router.query.id}/>
  </div>
))
export default Episode
