import React from 'react'
import { withRouter } from 'next/router'
import HeaderEpisode from '../components/Episode/HeaderEpisode'
import FooterMain from '../components/Episode/FooterMain'
import MainEpisode from '../components/Episode/MainEpisode'

const Episode = withRouter((props) => (
    <div>
        <HeaderEpisode idNovel={props.router.query.e} idEpisode={props.router.query.id}/>
        <MainEpisode idNovel={props.router.query.e} idEpisode={props.router.query.id}/>
        <FooterMain />
    </div>
))

export default Episode