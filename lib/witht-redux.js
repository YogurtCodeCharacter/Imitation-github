import React from 'react';
import createStore from '../store/store.js';

// TODO: 判断客户端还是服务端
const isServer = typeof window === 'undefined';
const _NEXT_REDUX_STORE_ = '_NEXT_REDUX_STORE_';


function getOrCreateStore(initialStore) {
    if (isServer) {
        // console.log('服务端');
        return createStore(initialStore);
    }

    if (!window[_NEXT_REDUX_STORE_]) {
        // console.log('客户端');
        window[_NEXT_REDUX_STORE_] = createStore(initialStore);
    }

    return window[_NEXT_REDUX_STORE_];
}

const WithReduxHoc = (Comp) => {
    class WithReduxApp extends React.Component {
        constructor(props) {
                super(props);
                this.reduxStore = getOrCreateStore(props.initialieReduxState);
        }

        render() {
            const { Component, pageProps, ...reset } = this.props;
            return <Comp Component={Component} pageProps={pageProps} {...reset} reduxStore = {this.reduxStore}></Comp>
        }
    }

    WithReduxApp.getInitialProps = async (ctx) => {
        let reduxStore = {};
        if (isServer) {
            const { req } = ctx.ctx;
            const session = req.session;
            if (session && session.userInfo) {
                reduxStore = getOrCreateStore({userInfo: session.userInfo})
            } else {
                reduxStore = getOrCreateStore();
            }
        } else {
            reduxStore = getOrCreateStore();
        }

        ctx.reduxStore = reduxStore;
        let appProps = {};
        if (typeof Comp.getInitialProps === 'function') {
            appProps = await Comp.getInitialProps(ctx);
        }

        return {
            ...appProps,
            initialieReduxState: reduxStore.getState()
        }
    };

    return WithReduxApp;
}

export default WithReduxHoc;