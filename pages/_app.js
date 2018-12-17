import React from 'react'
import App, { Container } from 'next/app'
import { Provider } from 'mobx-react';
import store from '../stores';

class MyApp extends App {

    static async getInitialProps({ Component, router, ctx }) {

        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps }
    }

    render() {
        const { Component, pageProps } = this.props
        return (
            <Provider {...store}>
                <Container>
                    <Component {...pageProps} />
                </Container>
            </Provider>
        )
    }
}

export default MyApp