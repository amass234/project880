import React from 'react'
import NextHead from 'next/head'
import NProgress from 'nprogress'
import { string } from 'prop-types'
import Router from 'next/router'


const defaultDescription = ''
const defaultOGURL = ''
const defaultOGImage = ''
Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

const Head = props => (
  <NextHead>
    <meta charSet="UTF-8" />
    <title>{props.title || ''}</title>
    <meta
      name="description"
      content={props.description || defaultDescription}
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
    <link rel="apple-touch-icon" href="/static/touch-icon.png" />
    <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
    <link rel="icon" href="/static/favicon.ico" />
    <link rel="stylesheet" href="/static/style.css"/>
    <link rel="stylesheet" href="/static/antd.css"/>
    <link rel="stylesheet" href="/static/react-draft-wysiwyg.css"/>
    <link rel="stylesheet" href="/static/bootstrap.min.css"/>
    <link rel="stylesheet" href="/static/default.css"/>
    <link rel="stylesheet" href="/static/ReactToastify.css"/>
    <link rel="stylesheet" href="/static/nprogress.css"/>
    <link rel="stylesheet" href="/static/react-tagsinput.css"/>
    <link rel="stylesheet" href="/static/hamburger.css"/>
    <link rel="stylesheet" href="/static/editor.css"/>
    <link rel="stylesheet" href="/static/ReactCrop.css"/>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
    <link href="https://fonts.googleapis.com/css?family=Prompt:300,400" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css?family=Dosis:300" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css?family=K2D" rel="stylesheet" />
    <meta property="og:url" content={props.url || defaultOGURL} />
    <meta property="og:title" content={props.title || ''} />
    <meta
      property="og:description"
      content={props.description || defaultDescription}
    />
    <meta name="twitter:site" content={props.url || defaultOGURL} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image" content={props.ogImage || defaultOGImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  </NextHead>
)

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string
}

export default Head
