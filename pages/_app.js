import App from 'next/app';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import Router from 'next/router';
import Link from 'next/link';
import Layout from '../components/layout/layout.js';
import PageLoadding from '../components/PageLoadding.jsx';
import WithReduxHoc from '../lib/witht-redux.js';


class MyApp extends App {
    state = {
        loadding: false
    };

    static async getInitialProps(ctx) {
        const { Component } = ctx;
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        return {
            pageProps
        }
    }

    startLoadding() {
        this.setState({
            loadding: true
        });
    }

    stopLoadding() {
        this.setState({
            loadding: false
        });
    }

    // TODO: 组件加载
    componentDidMount() {
        Router.events.on('routeChangeStart', this.startLoadding.bind(this));
        Router.events.on('routeChangeComplete', this.stopLoadding.bind(this)); 
        Router.events.on('routeChnageError', this.stopLoadding.bind(this));
    }

    // TODO: 组件卸载前
    componentWillUnmount() {
        Router.events.off('routeChangeStart', this.startLoadding.bind(this));
        Router.events.off('routeChangeComplete', this.stopLoadding.bind(this)); 
        Router.events.off('routeChnageError', this.stopLoadding.bind(this));
    }

    render() {
        const { Component, pageProps, reduxStore } = this.props;
        const { loadding } = this.state;
        return (<Provider store={reduxStore}>
            { loadding ? <PageLoadding /> : null }
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Provider>);
    }
}

export default WithReduxHoc(MyApp); 